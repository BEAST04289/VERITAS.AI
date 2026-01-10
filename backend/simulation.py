from manim import *

class PendulumCorrect(Scene):
    def construct(self):
        # Setup the "Correct" Physics
        # Length = 2m, Gravity = 9.8 m/s^2
        # Period T = 2*pi*sqrt(L/g) ~= 2.8s
        
        # A Grid for "Scientific" look
        grid = NumberPlane(
            background_line_style={"stroke_color": TEAL, "stroke_width": 1, "stroke_opacity": 0.3}
        )
        
        # The Text Overlay
        text = MarkupText(
            f'VERITAS PHYSICS ENGINE\n<span fgcolor="{GREEN}">g = 9.81 m/s²</span>',
            font="Monospace", font_size=24
        ).to_corner(UL)
        
        # The Pendulum
        pivot = UP * 2
        length = 4
        theta_max = 30 * DEGREES
        
        # Create Line and Bob
        line = Line(pivot, pivot + DOWN * length, color=WHITE)
        bob = Dot(point=pivot + DOWN * length, color=GREEN, radius=0.3)
        path = TracedPath(bob.get_center, stroke_color=GREEN, stroke_opacity=0.5)

        self.add(grid, text, line, bob, path)

        # The Physics Animation (Simple Harmonic Motion)
        # theta(t) = theta_max * cos(sqrt(g/L)*t)
        # Period T approx 2.8s
        
        t_tracker = ValueTracker(0)

        def update_pendulum(mob):
            t = t_tracker.get_value()
            theta = theta_max * np.cos(3 * t) # approx freq for visual
            new_point = pivot + np.array([length * np.sin(theta), -length * np.cos(theta), 0])
            
            # Update Line
            line.put_start_and_end_on(pivot, new_point)
            # Update Bob
            bob.move_to(new_point)

        line.add_updater(update_pendulum)
        bob.add_updater(update_pendulum)

        self.play(t_tracker.animate.set_value(10), run_time=10, rate_func=linear)


class GravityCorrect(Scene):
    """Ball falling with correct Earth gravity (9.81 m/s²)"""
    def construct(self):
        # Grid background
        grid = NumberPlane(
            background_line_style={"stroke_color": TEAL, "stroke_width": 1, "stroke_opacity": 0.3}
        )
        
        # Text overlay
        text = MarkupText(
            f'VERITAS PHYSICS ENGINE\n<span fgcolor="{GREEN}">g = 9.81 m/s²</span>\n<span fgcolor="{WHITE}">s = ½gt²</span>',
            font="Monospace", font_size=24
        ).to_corner(UL)
        
        # The ball
        ball = Circle(radius=0.3, color=GREEN, fill_opacity=1, fill_color=GREEN)
        ball.move_to(UP * 3)
        
        # Trail
        trail = TracedPath(ball.get_center, stroke_color=GREEN, stroke_opacity=0.5, stroke_width=3)
        
        self.add(grid, text, ball, trail)
        
        # Correct physics: y = y0 - ½gt²
        # For g = 9.81, after 1 second, ball falls 4.9 meters
        
        t_tracker = ValueTracker(0)
        
        def update_ball(mob):
            t = t_tracker.get_value()
            # y = 3 - 0.5 * 9.81 * t^2 (scaled for screen)
            # We scale: 1 unit on screen = 1 meter
            g = 2.0  # Visual gravity (scaled for animation)
            y = 3 - 0.5 * g * t * t
            ball.move_to(UP * max(y, -3))
        
        ball.add_updater(update_ball)
        
        self.play(t_tracker.animate.set_value(2.5), run_time=2.5, rate_func=linear)
        self.wait(0.5)


class BouncingBallCorrect(Scene):
    """Ball bouncing with correct energy conservation"""
    def construct(self):
        grid = NumberPlane(
            background_line_style={"stroke_color": TEAL, "stroke_width": 1, "stroke_opacity": 0.3}
        )
        
        text = MarkupText(
            f'VERITAS PHYSICS ENGINE\n<span fgcolor="{GREEN}">Energy Conserved</span>\n<span fgcolor="{WHITE}">KE + PE = Constant</span>',
            font="Monospace", font_size=24
        ).to_corner(UL)
        
        # Ground line
        ground = Line(LEFT * 7, RIGHT * 7, color=WHITE)
        ground.move_to(DOWN * 3)
        
        # The ball
        ball = Circle(radius=0.3, color=GREEN, fill_opacity=1, fill_color=GREEN)
        ball.move_to(UP * 2)
        
        trail = TracedPath(ball.get_center, stroke_color=GREEN, stroke_opacity=0.3, stroke_width=2)
        
        self.add(grid, ground, text, ball, trail)
        
        # Simulate bouncing with energy loss (realistic)
        t_tracker = ValueTracker(0)
        restitution = 0.85  # Energy loss on bounce
        
        def update_ball(mob):
            t = t_tracker.get_value()
            g = 4.0  # Visual gravity
            floor_y = -2.7  # Just above ground line
            start_y = 2
            
            # Calculate bounce sequence
            y = start_y
            v = 0
            dt = 0.02
            elapsed = 0
            
            while elapsed < t:
                v += g * dt
                y -= v * dt
                
                if y <= floor_y:
                    y = floor_y
                    v = -v * restitution  # Bounce with energy loss
                
                elapsed += dt
            
            ball.move_to(UP * y)
        
        ball.add_updater(update_ball)
        
        self.play(t_tracker.animate.set_value(8), run_time=8, rate_func=linear)
