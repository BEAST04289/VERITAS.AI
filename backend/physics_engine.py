import numpy as np
from scipy.optimize import curve_fit
import math

class PhysicsEngine:
    """
    VERITAS Multi-Physics Analysis Engine.
    Checks multiple physics laws to detect AI-generated content.
    """
    
    def __init__(self):
        self.EARTH_GRAVITY = 9.81  # m/s^2
        self.GRAVITY_TOLERANCE = 1.5  # +/- 1.5 m/s^2 allowed
        
    def parabolic_model(self, t, v0, g, h0):
        """Kinematic equation for vertical motion: y = h0 + v0*t - 0.5*g*t^2"""
        return h0 + v0*t - 0.5*g*t**2

    def check_gravity(self, timestamps, y_positions):
        """
        Physics Check 1: Gravity Verification
        Fits trajectory to parabolic model to extract 'g'.
        """
        try:
            popt, pcov = curve_fit(self.parabolic_model, timestamps, y_positions)
            v0_pred, g_pred, h0_pred = popt
            
            error = abs(g_pred - self.EARTH_GRAVITY)
            is_violation = error > self.GRAVITY_TOLERANCE
            
            return {
                "check": "GRAVITY",
                "status": "VIOLATION" if is_violation else "PASS",
                "measured": round(g_pred, 2),
                "expected": self.EARTH_GRAVITY,
                "deviation": round((g_pred - self.EARTH_GRAVITY) / self.EARTH_GRAVITY * 100, 1),
                "confidence": min(95 + error * 2, 99.9) if is_violation else 95 - error * 10
            }
        except Exception as e:
            return {"check": "GRAVITY", "status": "ERROR", "error": str(e)}

    def check_momentum_conservation(self, obj1_before, obj1_after, obj2_before, obj2_after, mass1=1.0, mass2=1.0):
        """
        Physics Check 2: Momentum Conservation (p = mv)
        For collisions: m1*v1 + m2*v2 = m1*v1' + m2*v2'
        """
        p_before = mass1 * obj1_before + mass2 * obj2_before
        p_after = mass1 * obj1_after + mass2 * obj2_after
        
        momentum_diff = abs(p_after - p_before)
        tolerance = 0.1 * abs(p_before) if p_before != 0 else 0.1
        
        is_violation = momentum_diff > tolerance
        
        return {
            "check": "MOMENTUM",
            "status": "VIOLATION" if is_violation else "PASS",
            "before": round(p_before, 2),
            "after": round(p_after, 2),
            "difference": round(momentum_diff, 2),
            "confidence": 90 if is_violation else 85
        }

    def check_shadow_consistency(self, light_angles):
        """
        Physics Check 3: Shadow/Lighting Consistency
        All shadows should point in consistent direction from same light source.
        """
        if len(light_angles) < 2:
            return {"check": "SHADOWS", "status": "INSUFFICIENT_DATA"}
        
        angle_variance = np.var(light_angles)
        max_variance = 15  # degrees
        
        is_violation = angle_variance > max_variance
        
        return {
            "check": "SHADOWS",
            "status": "VIOLATION" if is_violation else "PASS",
            "variance": round(angle_variance, 1),
            "max_allowed": max_variance,
            "confidence": 88 if is_violation else 80
        }

    def check_material_physics(self, material_type, impact_velocity, object_intact):
        """
        Physics Check 4: Material Physics (e.g., glass should shatter)
        """
        shatter_velocities = {
            "glass": 8.0,      # m/s
            "ceramic": 6.0,
            "plastic": 15.0,
            "wood": 20.0,
            "metal": 50.0
        }
        
        shatter_threshold = shatter_velocities.get(material_type.lower(), 10.0)
        should_break = impact_velocity >= shatter_threshold
        
        is_violation = should_break and object_intact
        
        return {
            "check": "MATERIAL",
            "status": "VIOLATION" if is_violation else "PASS",
            "material": material_type,
            "impact_velocity": impact_velocity,
            "shatter_threshold": shatter_threshold,
            "should_break": should_break,
            "actually_intact": object_intact,
            "confidence": 97 if is_violation else 85
        }

    def check_pendulum_physics(self, period, length):
        """
        Physics Check 5: Pendulum Period Verification
        T = 2π√(L/g) → g = 4π²L/T²
        """
        calculated_g = (4 * math.pi**2 * length) / (period**2)
        error = abs(calculated_g - self.EARTH_GRAVITY)
        is_violation = error > self.GRAVITY_TOLERANCE
        
        return {
            "check": "PENDULUM",
            "status": "VIOLATION" if is_violation else "PASS",
            "period": period,
            "length": length,
            "calculated_g": round(calculated_g, 2),
            "expected_g": self.EARTH_GRAVITY,
            "deviation": round((calculated_g - self.EARTH_GRAVITY) / self.EARTH_GRAVITY * 100, 1),
            "confidence": min(95 + error * 2, 99.9) if is_violation else 94.5
        }

    def check_projectile_motion(self, launch_angle, initial_velocity, max_height, range_distance):
        """
        Physics Check 6: Projectile Motion Verification
        max_height = (v0² sin²θ) / (2g)
        range = (v0² sin(2θ)) / g
        """
        theta_rad = math.radians(launch_angle)
        expected_max_height = (initial_velocity**2 * math.sin(theta_rad)**2) / (2 * self.EARTH_GRAVITY)
        expected_range = (initial_velocity**2 * math.sin(2 * theta_rad)) / self.EARTH_GRAVITY
        
        height_error = abs(max_height - expected_max_height) / expected_max_height if expected_max_height > 0 else 0
        range_error = abs(range_distance - expected_range) / expected_range if expected_range > 0 else 0
        
        is_violation = height_error > 0.15 or range_error > 0.15
        
        return {
            "check": "PROJECTILE",
            "status": "VIOLATION" if is_violation else "PASS",
            "measured_height": max_height,
            "expected_height": round(expected_max_height, 2),
            "measured_range": range_distance,
            "expected_range": round(expected_range, 2),
            "height_error": round(height_error * 100, 1),
            "range_error": round(range_error * 100, 1),
            "confidence": 92 if is_violation else 88
        }

    def analyze_trajectory(self, timestamps, y_positions):
        """Legacy method for backward compatibility"""
        return self.check_gravity(timestamps, y_positions)

    def run_full_analysis(self, motion_type, data):
        """
        Run comprehensive physics analysis based on motion type.
        Returns list of all physics checks performed.
        """
        results = []
        
        if motion_type == "pendulum":
            results.append(self.check_pendulum_physics(
                data.get("period", 2.0),
                data.get("length", 1.0)
            ))
        elif motion_type == "free_fall":
            results.append(self.check_gravity(
                data.get("timestamps", []),
                data.get("y_positions", [])
            ))
        elif motion_type == "projectile":
            results.append(self.check_projectile_motion(
                data.get("launch_angle", 45),
                data.get("initial_velocity", 10),
                data.get("max_height", 5),
                data.get("range", 10)
            ))
        elif motion_type == "collision":
            results.append(self.check_momentum_conservation(
                data.get("v1_before", 5),
                data.get("v1_after", 0),
                data.get("v2_before", 0),
                data.get("v2_after", 5)
            ))
        
        # Always check shadows if data available
        if "shadow_angles" in data:
            results.append(self.check_shadow_consistency(data["shadow_angles"]))
        
        # Check material physics if impact detected
        if "material" in data and "impact_velocity" in data:
            results.append(self.check_material_physics(
                data["material"],
                data["impact_velocity"],
                data.get("object_intact", True)
            ))
        
        return results

# Singleton instance
physics_kernel = PhysicsEngine()
