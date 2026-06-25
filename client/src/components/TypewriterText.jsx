import { useEffect, useState } from "react";

/**
 * TypewriterText
 * -----------------------------------------------------------------------------
 * Types out the given text character-by-character. Used inside cards to give
 * the "AI is composing the result" feel.
 *
 * Props:
 *   - text: string
 *   - speed: ms per character (default 14)
 *   - className: passthrough
 *   - onDone: callback when typing finishes
 */
export default function TypewriterText({ text, speed = 14, className = "", onDone }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) {
      onDone?.();
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  return <span className={className}>{displayed}</span>;
}
