"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mic, Square, Volume2 } from "lucide-react";

type Avatar = {
  id: string;
  name: string;
  src: string;      // /avatars/*.png (or .jpg/.webp)
  language: string; // "en-IN", "hi-IN", etc.
  audio: string;    // /audio/*.mp3
};

export default function TalkAvatar({ initialAvatars }: { initialAvatars: Avatar[] }) {
  const [active, setActive] = useState<Avatar>(initialAvatars[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ringClass = useMemo(
    () =>
      isPlaying
        ? "shadow-[0_0_0_3px_rgba(34,211,238,0.25)] ring-2 ring-cyan-400 animate-pulse"
        : "ring-1 ring-white/10",
    [isPlaying]
  );

  const onPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const onStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-start">
      {/* Avatar stage */}
      <div className="rounded-2xl border border-white/10 bg-black/60 p-4">
        <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 relative overflow-hidden grid place-items-center">
          {/* Avatar image */}
          <div className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden ${ringClass}`}>
            <Image
              src={active.src}
              alt={active.name}
              fill
              sizes="(max-width: 768px) 160px, 192px"
              className="object-cover"
              priority
            />
          </div>

          {/* Floating mic hint */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-300">
            <Volume2 className="w-4 h-4 text-cyan-300" />
            {active.language === "hi-IN" ? (
              <span>डेमो आवाज़ चलाएं</span>
            ) : (
              <span>Play sample voice</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-3">
          {!isPlaying ? (
            <Button onClick={onPlay} className="bg-cyan-600 hover:bg-cyan-500 text-white">
              <Mic className="w-4 h-4 mr-2" />
              {active.language === "hi-IN" ? "आवाज़ चलाएं" : "Play Voice"}
            </Button>
          ) : (
            <Button onClick={onStop} variant="outline" className="border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10">
              <Square className="w-4 h-4 mr-2" />
              {active.language === "hi-IN" ? "रोकें" : "Stop"}
            </Button>
          )}

          <audio
            ref={audioRef}
            src={active.audio}
            onEnded={() => setIsPlaying(false)}
            preload="auto"
            className="hidden"
          />
        </div>
      </div>

      {/* Avatar selector */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">{active.name}</h4>
            <p className="text-xs text-slate-400">Language: {active.language}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 rounded-full">
            Voice Demo
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {initialAvatars.map((av) => (
            <button
              key={av.id}
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
                setIsPlaying(false);
                setActive(av);
              }}
              className={`group relative rounded-xl overflow-hidden border ${
                active.id === av.id ? "border-cyan-400" : "border-white/10"
              }`}
              title={`${av.name} • ${av.language}`}
            >
              <div className="relative w-full aspect-square">
                <Image src={av.src} alt={av.name} fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-[11px] text-slate-200">
                {av.name}
              </div>
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Tip: connect real-time TTS/ASR to stream speech. This demo uses static audio files.
        </p>
      </div>
    </div>
  );
}
