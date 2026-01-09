import numpy as np
from scipy.optimize import curve_fit

class PhysicsEngine:
    """
    The Core Truth Kernel of VERITAS.
    Uses kinematics to verify video motion against immutable laws of physics.
    """
    
    def __init__(self):
        self.EARTH_GRAVITY = 9.81  # m/s^2
        self.GRAVITY_TOLERANCE = 1.5  # +/- 1.5 m/s^2 allowed for drag/error
        
    def parabolic_model(self, t, v0, g, h0):
        """
        Kinematic equation for vertical motion:
        y = h0 + v0*t - 0.5*g*t^2
        """
        return h0 + v0*t - 0.5*g*t**2

    def analyze_trajectory(self, timestamps, y_positions):
        """
        Fits the observed trajectory to the parabolic model to extract 'g'.
        Returns:
            verdict (str): 'REAL' / 'FAKE'
            calculated_g (float): The gravity found in the video.
            confidence (float): Statistical fit confidence (R^2).
        """
        try:
            # Fit data to model
            # popt = [v0, g, h0]
            popt, pcov = curve_fit(self.parabolic_model, timestamps, y_positions)
            v0_pred, g_pred, h0_pred = popt
            
            # Analyze Gravity
            error = abs(g_pred - self.EARTH_GRAVITY)
            
            if error <= self.GRAVITY_TOLERANCE:
                return {
                    "verdict": "VERIFIED",
                    "reason": f"Gravity {g_pred:.2f} m/s^2 is consistent with Earth.",
                    "g_calculated": g_pred,
                    "is_anomaly": False
                }
            else:
                return {
                    "verdict": "SYNTHETIC",
                    "reason": f"Gravity {g_pred:.2f} m/s^2 violates physical laws (Earth=9.8).",
                    "g_calculated": g_pred,
                    "is_anomaly": True
                }
                
        except Exception as e:
            return {"error": str(e), "verdict": "ERROR"}

# Singleton instance
physics_kernel = PhysicsEngine()
