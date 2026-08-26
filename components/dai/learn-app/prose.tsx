import css from "./lesson-player.module.css";

/**
 * Renders `backticked` spans in authored prose as inline code.
 *
 * Lesson copy, quiz explanations and exercise explanations are all written
 * with markdown-style backticks, so every surface that shows them needs the
 * same treatment — hence one function rather than three copies.
 */
export function prose(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2
      ? <code className={css.inline} key={i}>{part.slice(1, -1)}</code>
      : <span key={i}>{part}</span>,
  );
}
