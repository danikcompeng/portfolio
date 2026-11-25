/**
 * Which story step is on screen in the pinned layout.
 *
 * `tops` are the steps' top edges relative to the viewport, in order; `centre` is the
 * viewport's centre line. The active step is the last one whose top has reached the line.
 * Above step 1 the answer is -1 (the phone plays the video). Past the last step it stays on
 * the last step, so the phone doesn't flick back to the video as it unpins
 * (plans/portfolio.md, logic-checker #4).
 */
export function activeStep(tops: readonly number[], centre: number): number {
  let active = -1;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= centre) active = i;
    else break;
  }
  return active;
}
