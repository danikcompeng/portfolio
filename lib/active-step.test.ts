import { describe, expect, it } from "vitest";
import { activeStep } from "./active-step";

describe("activeStep", () => {
  const centre = 450;
  it("is -1 (the video) above step 1", () => {
    expect(activeStep([600, 1300, 2000, 2700], centre)).toBe(-1);
  });
  it("switches exactly when a step's top reaches the centre line", () => {
    expect(activeStep([451, 1151], centre)).toBe(-1);
    expect(activeStep([450, 1150], centre)).toBe(0);
  });
  it("is the last step whose top has passed", () => {
    expect(activeStep([-800, -100, 400, 1100], centre)).toBe(2);
  });
  it("stays on the last step past the end, never back to the video", () => {
    expect(activeStep([-3000, -2300, -1600, -900], centre)).toBe(3);
  });
  it("handles no steps", () => {
    expect(activeStep([], centre)).toBe(-1);
  });
});
