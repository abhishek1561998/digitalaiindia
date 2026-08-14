"use client";

import { useEffect } from "react";

// Deterrent, not protection. DevTools can still be opened from the browser
// menu, and view-source / curl never run this code at all — anything shipped
// to a browser is readable by definition. This only raises the effort for
// casual copying of course content.
//
// Deliberately scoped: right-click still works inside inputs, textareas and
// contenteditable regions, because the playground and every form need
// paste/copy to function.
function isEditable(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el || !el.closest) return false;
  return Boolean(el.closest('input, textarea, select, [contenteditable="true"]'));
}

export function ContentProtection() {
  useEffect(() => {
    function onContextMenu(e: MouseEvent) {
      if (isEditable(e.target)) return;
      e.preventDefault();
    }

    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd+Shift+I / J / C — devtools panels
      if (mod && e.shiftKey && (key === "i" || key === "j" || key === "c")) {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd+U — view source. Left alone inside editable fields so
      // Cmd+U style shortcuts there aren't hijacked.
      if (mod && key === "u" && !isEditable(e.target)) {
        e.preventDefault();
      }
    }

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
