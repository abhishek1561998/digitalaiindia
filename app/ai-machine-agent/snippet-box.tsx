"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const snippet = `<script>
  (function(w,d,s,u,id){
    if(d.getElementById(id)) return;
    const js=d.createElement(s); js.id=id; js.async=true; js.src=u;
    d.head.appendChild(js);
  })(window,document,'script','https://cdn.digitalaiindia.com/agent-widget.min.js','dai-widget');
</script>
<script>
  window.DAI = window.DAI || {};
  window.DAI.init = {
    wsUrl: "wss://api.digitalaiindia.com/ws/public-demo-001",
    theme: { accent: "#0ea5e9" },
    lang: "en-IN",
    startOpen: false
  };
</script>`;

export default function SnippetBox() {
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <Button
        variant="outline"
        className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 mb-3"
        onClick={async () => {
          await navigator.clipboard.writeText(snippet);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied!" : "Copy Snippet"}
      </Button>
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black p-4 text-xs text-slate-300 whitespace-pre-wrap">
        {snippet}
      </pre>
    </div>
  );
}
