import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Zap, Globe2, Cpu, Shield, Headphones } from "lucide-react";
import TalkAvatar from "./talk-avatar";
import { avatars } from "./avatars";
import ThemeBackdrop from "./ThemeBackdrop";

export const metadata: Metadata = {
  title: "AI Machine Agent — DigitalAI India",
  description:
    "Multilingual, voice-ready AI agents that talk, sell, and support 24/7. Train on your PDFs/URLs/FAQs and deploy on Web & WhatsApp.",
  alternates: { canonical: "/ai-machine-agent" },
  openGraph: {
    title: "AI Machine Agent — DigitalAI India",
    description:
      "Deploy AI Machine Agents with voice + chat, multilingual support, and RAG on your data.",
    url: "https://digitalaiindia.com/ai-machine-agent",
    type: "website",
    siteName: "DigitalAI India",
  },
};

export default function AiMachineAgentPage() {
  return (
    <main className="relative min-h-screen text-white">
      {/* THEME BACKDROP */}
      <ThemeBackdrop />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-18 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs text-orange-300">
            <Zap className="w-3.5 h-3.5" /> New: Multilingual Voice + Avatar
          </span>
          <h1 className="mt-5 text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              AI Machine Agents —
            </span>
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Talk, Sell & Support 24/7
            </span>
          </h1>
          <p className="mt-5 text-slate-300/90 text-lg md:text-xl max-w-3xl mx-auto">
            Natural voice + chat agents trained on your PDFs, URLs & FAQs. Deploy on Web and WhatsApp with one script.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/contact">
              <Button
                size="lg"
                className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 border-0 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Book a Demo
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create-chatbot">
                <Button
                  size="lg"
                  className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-0 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Create Chatbot
                </Button>
              </Link>
              <Link href="/voice-showcase">
                <Button
                  size="lg"
                  variant="outline"
                  className="group px-8 py-4 text-lg font-semibold border-2 border-orange-400/50 text-orange-300 hover:bg-orange-400/10 hover:border-orange-400 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                >
                  Try Voice Agent
                </Button>
              </Link>
              <Link href="/voice-premium">
                <Button
                  size="lg"
                  className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 border-0 shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Premium Features
                </Button>
              </Link>
            </div>
          </div>

          {/* Talking Avatar Block */}
          <div
            id="live-demo"
            className="mt-12 mx-auto max-w-5xl rounded-2xl border border-orange-400/20 bg-black/50 p-1 backdrop-blur-md"
          >
            <div className="rounded-xl bg-black/70 p-4">
              <TalkAvatar initialAvatars={avatars} />
              <p className="mt-3 text-xs text-slate-400 text-left">
                Demo audio is a sample line. Replace with your TTS stream or recorded voice.
              </p>
            </div>
          </div>

          {/* Divider accent */}
          <div className="mt-10 w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto rounded-full" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-orange-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: Globe2, title: "Multilingual Voice", desc: "Low-latency ASR + TTS for English, Hindi & regional languages." },
            { icon: Cpu, title: "RAG on Your Data", desc: "Index PDFs, URLs & FAQs with pgvector/Pinecone for precise answers." },
            { icon: Shield, title: "Guardrails", desc: "PII redaction, domain allow-list, rate-limit & audit logs." },
            { icon: Headphones, title: "Omnichannel", desc: "Web embed today; WhatsApp & IVR as you grow." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-black/50 p-5 hover:bg-white/[0.07] transition"
            >
              <Icon className="w-6 h-6 text-orange-300" />
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-slate-300 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="solutions" className="relative max-w-7xl mx-auto px-6 md:px-12 pb-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Industry-ready Agents</h2>
        <p className="mt-2 text-slate-300">Pre-scripted flows you can customize in minutes.</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Real Estate","E-commerce","Hospitality","Healthcare","Education","Legal","Media","Financial Services"].map((x) => (
            <div
              key={x}
              className="rounded-2xl border border-orange-400/20 bg-black/50 p-4 hover:bg-white/[0.07] transition"
            >
              <div className="aspect-video rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 mb-3 grid place-items-center text-slate-400 text-sm">
                Demo
              </div>
              <div className="font-medium">{x}</div>
              <ul className="mt-1 text-slate-400 text-xs space-y-1">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-300" /> Lead capture</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-300" /> Qualification</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-300" /> Follow-ups</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <h2 className="text-2xl md:text-3xl font-semibold">How it Works</h2>
        <ol className="mt-6 grid md:grid-cols-5 gap-4">
          {[
            ["Choose Persona","Pick voice, tone & (optional) avatar"],
            ["Feed Knowledge","Upload PDFs, add URLs, paste FAQs"],
            ["Train","One-click index & preview answers"],
            ["Embed","Paste one script to go live"],
            ["Monitor","View transcripts, KPIs, CSAT"],
          ].map(([h, s], i) => (
            <li key={i} className="p-4 rounded-xl border border-white/10 bg-black/50">
              <div className="text-xs text-slate-400">{i + 1}</div>
              <div className="font-semibold">{h}</div>
              <div className="text-slate-300 text-sm">{s}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* WIDGET SNIPPET */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pb-14">
        <div className="rounded-2xl border border-orange-400/20 bg-black/50 p-6 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold">Add the Widget to Your Site</h3>
              <p className="text-slate-300 mt-1">Copy-paste this snippet. No heavy SDKs required.</p>
            </div>
            <Link href="/voice-showcase">
              <Button className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white border-0 shadow-lg hover:shadow-orange-500/25 transition">
                Open Voice Demo
              </Button>
            </Link>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/80 p-4 text-xs text-slate-300 whitespace-pre-wrap">
{`<script>
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
    theme: { accent: "#f97316" },
    lang: "en-IN",
    startOpen: false
  };
</script>`}
          </pre>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section id="contact" className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Ready to launch your AI Machine Agent?</h3>
          <p className="mt-2 text-slate-300 max-w-2xl mx-auto">
            We’ll help you pick a voice, load your knowledge, and go live this week.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/pricing">
              <Button
                variant="outline"
                className="group px-6 py-3 border-2 border-orange-400/50 text-orange-300 hover:bg-orange-400/10 hover:border-orange-400 transition"
              >
                See Pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white border-0 shadow-lg hover:shadow-orange-500/25 transition">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
