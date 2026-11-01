"""Run with Python and matplotlib; change GAINS to (0.5, 2.0) to compare gains."""

from pathlib import Path

import matplotlib.pyplot as plt

GAINS = (1.0,)
STEPS = 200


def simulate(kp: float, steps: int = STEPS) -> list[float]:
    """Simulate x_next = 0.9*x + 0.1*u with proportional feedback."""
    output = [0.0]
    for _ in range(steps):
        control = kp * (1.0 - output[-1])
        output.append(0.9 * output[-1] + 0.1 * control)
    return output


def main() -> None:
    for kp in GAINS:
        output = simulate(kp)
        plt.plot(output, label=f"Kp = {kp}")
        print(f"Kp={kp}: final output={output[-1]:.3f}, error={1-output[-1]:.3f}")
    plt.axhline(1.0, color="gray", linestyle="--", label="Target")
    plt.xlabel("Simulation step")
    plt.ylabel("Plant output")
    plt.legend()
    plt.grid(alpha=0.2)
    destination = Path("feedback-response.png")
    plt.savefig(destination, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"Open {destination.resolve()} to inspect the response.")


if __name__ == "__main__":
    main()
