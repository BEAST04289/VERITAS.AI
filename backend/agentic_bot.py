from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

class InterrogatorBot:
    """
    The Agentic Brain of VERITAS.
    Intervenes when physics analysis is inconclusive.
    Asks the user for context ("Is this glass?") to resolve ambiguity.
    """
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def evaluate_ambiguity(self, physics_data):
        """
        Decides if the Agent needs to talk to the human.
        Input: Physics calculation results (g, confidence).
        Output: Boolean (True = Needs Help).
        """
        confidence = physics_data.get("confidence", 100)
        # If confidence is low (e.g. 50-70%), we need context
        if 50 < confidence < 80:
            return True
        return False

    def generate_question(self, scene_context):
        """
        Uses Gemini Deep Think to ask a smart question.
        e.g. "I see a collision. Is the object elastic?"
        """
        if not self.client:
            return "Ambiguity detected. Please provide material context."

        prompt = f"""
        You are VERITAS, a Physics Verification Agent.
        Analysis is ambiguous because: {scene_context}
        Ask the user ONE specific question to clarify the physics properties (Mass, Material, Friction).
        Keep it military/concise.
        """
        
        # Mock response for now
        return "AMBIGUITY DETECTED. INTERROGATION: Is the falling object rigid or elastic?"

agent = InterrogatorBot()
