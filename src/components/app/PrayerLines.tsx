// A prayer's lines set as the Church's service books set them: directions in red (rubrics), repeat marks such as
// "(3x)" in red, and a red initial on the first line that is prayed. The text itself is never changed, because
// recorded narration is matched to it word for word.

// Lines that tell you what to do, rather than words to pray, start with one of these.
const DIRECTION = /^(Stand|Sit|Make|Bow|Kneel|Light|Pause|Breathe|Read|Say|Pray|Repeat|Then|Take|Close|Turn|Remain|Rise|Cross)\b/;
// "(3x)", "(x3)", "(12 times)", "(thrice)" and similar. The capture group keeps each mark when the line is split.
const REPEAT = /(\((?:\d+\s*x|x\s*\d+|\d+\s*times|thrice|three times)\))/i;

export function isDirection(line: string) {
  const text = line.trim();
  return DIRECTION.test(text) && text.length < 140;
}

function WithRepeatMarks({ text }: { text: string }) {
  // split() with a capture group puts the marks at the odd indices.
  return (
    <>
      {text.split(REPEAT).map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="text-cinnabar">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function PrayerLines({ lines }: { lines: string[] }) {
  const firstPrayed = lines.findIndex((line) => !isDirection(line) && /^[A-Za-z]/.test(line.trim()));
  return (
    <>
      {lines.map((line, index) => {
        if (isDirection(line)) {
          return (
            <p key={index} className="rubric">
              {line}
            </p>
          );
        }
        if (index === firstPrayed) {
          // The red initial is drawn with ::first-letter, so the text stays whole for screen readers and search.
          return (
            <p key={index} className="drop-cap">
              <WithRepeatMarks text={line.trimStart()} />
            </p>
          );
        }
        return (
          <p key={index}>
            <WithRepeatMarks text={line} />
          </p>
        );
      })}
    </>
  );
}
