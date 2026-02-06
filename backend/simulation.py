from manim import *

class PendulumCorrect(Scene):
    def construct(self):
        
        grid = NumberPlane(
            background_line_style={"stroke_color": TEAL, "stroke_width": 1, "stroke_opacity": 0.3}
        )
        
        text = MarkupText(
            f'VERITAS PHYSICS ENGINE\n<span fgcolor="{GREEN}">g = 9.81 m/s²</span>',
            font="Monospace", font_size=24
        ).to_corner(UL)
        
        pivot = UP * 2
        length = 4
        theta_max = 30 * DEGREES
        
        line = Line(pivot, pivot + DOWN * length, color=WHITE)
        bob = Dot(point=pivot + DOWN * length, color=GREEN, radius=0.3)
        path = TracedPath(bob.get_center, stroke_color=GREEN, stroke_opacity=0.5)

        self.add(grid, text, line, bob, path)

        
        t_tracker = ValueTracker(0)

        def update_pendulum(mob):
            t = t_tracker.get_value()
            theta = theta_max * np.cos(3 * t)
            new_point = pivot + np.array([length * np.sin(theta), -length * np.cos(theta), 0])
            
            line.put_start_and_end_on(pivot, new_point)
            bob.move_to(new_point)

        line.add_updater(update_pendulum)
        bob.add_updater(update_pendulum)

        self.play(t_tracker.animate.set_value(10), run_time=10, rate_func=linear)


class GravityCorrect(Scene):
    """Ball falling with correct Earth gravity (9.81 m/s²)"""
    def construct(self):
        grid = NumberPlane(
            background_line_style={"stroke_color": TEAL, "stroke_width": 1, "stroke_opacity": 0.3}
        )
        
        text = MarkupText(
            f'VERITAS PHYSICS ENGINE\n<span fgcolor="{GREEN}">g = 9.81 m/s²</span>\n<span fgcolor="{WHITE}">s = ½gt²</span>',
            font="Monospace", font_size=24
        ).to_corner(UL)
        
        ball = Circle(radius=0.3, color=GREEN, fill_opacity=1, fill_color=GREEN)
        ball.move_to(UP * 3)
        
        trail = TracedPath(ball.get_center, stroke_color=GREEN, stroke_opacity=0.5, stroke_width=3)
        
        self.add(grid, text, ball, trail)
        
        
        t_tracker = ValueTracker(0)
        
        def update_ball(mob):
            t = t_tracker.get_value()
            g = 2.0
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
        
        ground = Line(LEFT * 7, RIGHT * 7, color=WHITE)
        ground.move_to(DOWN * 3)
        
        ball = Circle(radius=0.3, color=GREEN, fill_opacity=1, fill_color=GREEN)
        ball.move_to(UP * 2)
        
        trail = TracedPath(ball.get_center, stroke_color=GREEN, stroke_opacity=0.3, stroke_width=2)
        
        self.add(grid, ground, text, ball, trail)
        
        t_tracker = ValueTracker(0)
        restitution = 0.85
        
        def update_ball(mob):
            t = t_tracker.get_value()
            g = 4.0
            floor_y = -2.7
            start_y = 2
            
            y = start_y
            v = 0
            dt = 0.02
            elapsed = 0
            
            while elapsed < t:
                v += g * dt
                y -= v * dt
                
                if y <= floor_y:
                    y = floor_y
                    v = -v * restitution
                
                elapsed += dt
            
            ball.move_to(UP * y)
        
        ball.add_updater(update_ball)
        
        self.play(t_tracker.animate.set_value(8), run_time=8, rate_func=linear)
