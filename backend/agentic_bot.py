"""
VERITAS Agentic Interrogator
Human-in-the-loop reasoning when physics is ambiguous.
"""
from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

class InterrogatorBot:
    """
    The Agentic Brain - asks clarifying questions when uncertain.
    """
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=api_key) if api_key else None
        
        # Ambiguity thresholds
        self.AMBIGUITY_THRESHOLD = 0.3  # 30% uncertainty triggers questioning
        
        # Question templates based on physics type
        self.question_templates = {
            "material": {
                "trigger": "impact_detected",
                "question": "I detected an impact at {velocity} m/s. What material is this object? (glass/plastic/metal/wood)",
                "physics_implications": {
                    "glass": {"shatter_velocity": 8.0, "should_break": True},
                    "plastic": {"shatter_velocity": 15.0, "should_break": False},
                    "metal": {"shatter_velocity": 50.0, "should_break": False},
                    "wood": {"shatter_velocity": 20.0, "should_break": False}
                }
            },
            "gravity": {
                "trigger": "gravity_anomaly",
                "question": "Gravity reads {g} m/s². Is this on Earth, Moon, Mars, or underwater?",
                "physics_implications": {
                    "earth": 9.81,
                    "moon": 1.62,
                    "mars": 3.72,
                    "underwater": 0.5
                }
            },
            "collision": {
                "trigger": "momentum_anomaly",
                "question": "I see a collision with unusual momentum. Is this an elastic or inelastic collision?",
                "physics_implications": {
                    "elastic": {"coefficient": 1.0},
                    "inelastic": {"coefficient": 0.0}
                }
            },
            "deceleration": {
                "trigger": "deceleration_high",
                "question": "I calculated {g}g deceleration. Is this a crash into a wall, tree, or soft barrier?",
                "physics_implications": {
                    "wall": {"max_g": 100, "survivable": False},
                    "tree": {"max_g": 60, "survivable": False},
                    "soft_barrier": {"max_g": 20, "survivable": True}
                }
            }
        }
    
    def evaluate_ambiguity(self, physics_result: dict) -> dict:
        """
        Evaluate if the physics result is ambiguous and needs user input.
        Returns: {needs_input: bool, question_type: str, question: str}
        """
        needs_input = False
        question_type = None
        question = None
        
        # Check gravity anomaly
        g = physics_result.get("calculated_g", physics_result.get("gravity", 9.8))
        deviation = abs(g - 9.8) / 9.8
        
        # Moderate anomaly (10-40%) - could be fake OR unusual environment
        if 0.1 < deviation < 0.4:
            needs_input = True
            question_type = "gravity"
            question = self.question_templates["gravity"]["question"].format(g=round(g, 2))
        
        # Check for impact events
        if physics_result.get("impact_detected"):
            velocity = physics_result.get("impact_velocity", 10)
            needs_input = True
            question_type = "material"
            question = self.question_templates["material"]["question"].format(velocity=velocity)
        
        # Check for high deceleration
        if physics_result.get("deceleration", 0) > 30:
            needs_input = True
            question_type = "deceleration"
            question = self.question_templates["deceleration"]["question"].format(
                g=physics_result.get("deceleration")
            )
        
        return {
            "needs_input": needs_input,
            "question_type": question_type,
            "question": question,
            "physics_implications": self.question_templates.get(question_type, {}).get("physics_implications", {})
        }
    
    def process_user_answer(self, question_type: str, answer: str, physics_result: dict) -> dict:
        """
        Process user's answer and provide reasoning.
        """
        template = self.question_templates.get(question_type, {})
        implications = template.get("physics_implications", {})
        
        answer_lower = answer.lower().strip()
        
        reasoning_steps = []
        is_fake = False
        confidence = 0.0
        
        if question_type == "material":
            material_data = implications.get(answer_lower, {})
            shatter_threshold = material_data.get("shatter_velocity", 10)
            impact_velocity = physics_result.get("impact_velocity", 15)
            object_intact = physics_result.get("object_intact", True)
            
            reasoning_steps.append(f"User identified material as: {answer}")
            reasoning_steps.append(f"{answer.capitalize()} shatters at {shatter_threshold} m/s")
            reasoning_steps.append(f"Detected impact velocity: {impact_velocity} m/s")
            
            should_break = impact_velocity >= shatter_threshold
            
            if should_break and object_intact:
                is_fake = True
                confidence = 0.95
                reasoning_steps.append(f"ERROR: {answer.capitalize()} should shatter at this velocity")
                reasoning_steps.append("VERDICT: SYNTHETIC - Material physics violated")
            else:
                is_fake = False
                confidence = 0.85
                reasoning_steps.append("Material behavior is consistent with physics")
        
        elif question_type == "gravity":
            expected_g = implications.get(answer_lower, 9.81)
            measured_g = physics_result.get("calculated_g", physics_result.get("gravity", 9.8))
            
            reasoning_steps.append(f"User specified environment: {answer}")
            reasoning_steps.append(f"Expected gravity for {answer}: {expected_g} m/s²")
            reasoning_steps.append(f"Measured gravity: {measured_g:.2f} m/s²")
            
            error = abs(measured_g - expected_g) / expected_g
            
            if error > 0.2:  # More than 20% error
                is_fake = True
                confidence = 0.90
                reasoning_steps.append(f"ERROR: Gravity doesn't match {answer} environment")
                reasoning_steps.append("VERDICT: SYNTHETIC - Gravity violation confirmed")
            else:
                is_fake = False
                confidence = 0.92
                reasoning_steps.append(f"Gravity is consistent with {answer} environment")
                reasoning_steps.append("VERDICT: AUTHENTIC - Environment explains deviation")
        
        elif question_type == "deceleration":
            barrier_data = implications.get(answer_lower, {"max_g": 50})
            max_survivable = barrier_data.get("max_g", 50)
            measured_g = physics_result.get("deceleration", 40)
            
            reasoning_steps.append(f"User identified collision type: {answer}")
            reasoning_steps.append(f"Maximum expected G-force for {answer}: {max_survivable}g")
            reasoning_steps.append(f"Measured deceleration: {measured_g}g")
            
            if measured_g > max_survivable * 1.5:
                is_fake = True
                confidence = 0.88
                reasoning_steps.append(f"ERROR: Deceleration exceeds {answer} physics")
            else:
                is_fake = False
                confidence = 0.82
                reasoning_steps.append("Deceleration is within expected range")
        
        return {
            "is_fake": is_fake,
            "confidence": confidence,
            "reasoning_steps": reasoning_steps,
            "user_context": answer
        }
    
    def generate_explanation(self, physics_results: list, verdict: str) -> str:
        """
        Generate human-readable explanation using Gemini.
        """
        if not self.client:
            # Fallback without API
            explanations = []
            for result in physics_results:
                check = result.get("check", "Unknown")
                status = result.get("status", "PASS")
                if status == "VIOLATION":
                    if check == "GRAVITY":
                        explanations.append(f"Gravity reads {result.get('calculated_g', 'N/A')} m/s² instead of 9.8 - impossible on Earth")
                    elif check == "SHADOWS":
                        explanations.append("Shadows point in multiple directions - multiple light sources detected")
                    elif check == "MOMENTUM":
                        explanations.append("Momentum not conserved - energy appeared/disappeared")
                    elif check == "MATERIAL":
                        explanations.append("Material physics violated - object should have broken")
            
            if not explanations:
                return "All physics checks passed. Content appears authentic."
            
            return "VIOLATIONS DETECTED:\n• " + "\n• ".join(explanations)
        
        try:
            prompt = f"""You are a physics forensics expert. Explain why this video is {verdict} in simple terms.

Physics analysis results:
{json.dumps(physics_results, indent=2)}

Write a brief, compelling explanation (2-3 sentences) that a non-scientist can understand.
Focus on the specific physics violation if any."""

            response = self.client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text
        except:
            return "Analysis complete. See detailed results above."

# Singleton
interrogator = InterrogatorBot()
