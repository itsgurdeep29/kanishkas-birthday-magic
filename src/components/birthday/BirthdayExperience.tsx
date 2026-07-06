import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles as SparkIcon, ChevronRight, RotateCcw } from "lucide-react";
import { FloatingBackground, Sparkles, CursorParticles, MusicToggle } from "./Effects";
import { burstConfetti, megaConfetti, heartExplosion } from "./confetti";

type Step =
  | "envelope"
  | "ready"
  | "maybe"
  | "reveal"
  | "photos"
  | "choice"
  | "letter"
  | "more"
  | "wish"
  | "cake"
  | "final"
  | "last";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

import k1 from "@/assets/kanishka/kanishka1.jpeg";
import k2 from "@/assets/kanishka/kanishka2.jpeg";
import k3 from "@/assets/kanishka/kanishka3.jpeg";
import k4 from "@/assets/kanishka/kanishka4.jpeg";
import k5 from "@/assets/kanishka/kanishka5.jpeg";
import k6 from "@/assets/kanishka/kanishka6.jpeg";

// Replace image sources with Kanishka's photos anytime
const PHOTOS: { src: string; caption: string }[] = [
  { src: k1, caption: "Pretty as always 🎀" },
  { src: k2, caption: "This smile >>> 💗" },
  { src: k3, caption: "Main character energy ✨" },
  { src: k4, caption: "Okay, this one's actually cute 😌" },
  { src: k5, caption: "Certified Kanishka moment 😂" },
  { src: k6, caption: "Too much cuteness in one frame 🎀" },
];

export default function BirthdayExperience() {
  const [step, setStep] = useState<Step>("envelope");
  const [interacted, setInteracted] = useState(false);
  const [nightMode, setNightMode] = useState(false);

  const go = (s: Step) => {
    setInteracted(true);
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Night mode for letter section
  useEffect(() => {
    setNightMode(step === "letter" || step === "wish");
  }, [step]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <FloatingBackground variant={nightMode ? "night" : "day"} />
      <CursorParticles />
      <MusicToggle started={interacted} />

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {step === "envelope" && <Envelope key="envelope" onOpen={() => go("ready")} />}
          {step === "ready" && <ReadyQuestion key="ready" onYes={() => go("reveal")} onMaybe={() => go("maybe")} />}
          {step === "maybe" && <MaybeStep key="maybe" onYes={() => go("reveal")} />}
          {step === "reveal" && <Reveal key="reveal" onNext={() => go("photos")} />}
          {step === "photos" && <PhotoMemories key="photos" onNext={() => go("choice")} />}
          {step === "choice" && <ChoiceGame key="choice" onNext={() => go("letter")} />}
          {step === "letter" && <Letter key="letter" onNext={() => go("more")} />}
          {step === "more" && <OneMoreThing key="more" onNext={() => go("wish")} />}
          {step === "wish" && <WishJar key="wish" onNext={() => go("cake")} />}
          {step === "cake" && <CakeSection key="cake" onNext={() => go("final")} />}
          {step === "final" && <FinalScreen key="final" onReplay={() => go("envelope")} onLast={() => go("last")} />}
          {step === "last" && <LastClick key="last" onReplay={() => go("envelope")} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ============ SECTIONS ============ */

function Envelope({ onOpen }: { onOpen: () => void }) {
  const [showSub, setShowSub] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowSub(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.section {...fadeUp} className="text-center max-w-2xl mx-auto">
      <Sparkles count={14} />
      <motion.h1
        className="font-script text-5xl md:text-7xl text-gradient mb-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Hey Kanishka 👀💗
      </motion.h1>
      <AnimatePresence>
        {showSub && (
          <motion.p
            className="font-display italic text-xl md:text-2xl text-plum mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Tumhare liye kuch hai...
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        className="relative mx-auto w-56 h-56 md:w-72 md:h-72 mb-10"
        animate={{ y: [0, -14, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-3xl blur-3xl bg-primary/40" />
        <div className="relative w-full h-full grid place-items-center text-9xl md:text-[10rem] drop-shadow-2xl">
          🎁
        </div>
      </motion.div>

      <motion.button
        onClick={onOpen}
        className="btn-cute text-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Open it 🎁
      </motion.button>
    </motion.section>
  );
}

function ReadyQuestion({ onYes, onMaybe }: { onYes: () => void; onMaybe: () => void }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noMsg, setNoMsg] = useState("");
  const noMessages = [
    "Ye option allowed nahi hai 😌",
    "Nice try Kanishka 😂",
    "Birthday girl ko YES bolna padega 🎀",
    "Tushar ne NO button disable karwaya hai 😂",
    "Pakad ke dikhao pehle 🏃‍♀️💨",
  ];
  const dodgeNo = () => {
    setNoPos({ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 200 });
    setNoMsg(noMessages[Math.floor(Math.random() * noMessages.length)]);
  };

  return (
    <motion.section {...fadeUp} className="text-center max-w-2xl mx-auto">
      <p className="font-script text-2xl md:text-3xl text-plum mb-2">Wait wait...</p>
      <h2 className="font-display text-3xl md:text-5xl font-semibold mb-3">
        pehle ek important question 😌
      </h2>
      <p className="font-script text-2xl md:text-3xl text-gradient mb-10">
        Are you ready for your birthday surprise? 🎀
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
        <motion.button onClick={onYes} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-cute">
          Yesss! 🥹💗
        </motion.button>
        <motion.button
          onClick={onMaybe}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass px-8 py-3.5 rounded-full font-semibold text-plum"
        >
          Maybe... 👀
        </motion.button>
        <motion.button
          onMouseEnter={dodgeNo}
          onTouchStart={dodgeNo}
          onClick={dodgeNo}
          animate={{ x: noPos.x, y: noPos.y }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="glass px-8 py-3.5 rounded-full font-semibold text-plum"
        >
          No 😌
        </motion.button>
      </div>
      <AnimatePresence>
        {noMsg && (
          <motion.p
            key={noMsg}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-script text-xl text-rose mt-8"
          >
            {noMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function MaybeStep({ onYes }: { onYes: () => void }) {
  const [thinkingMsg, setThinkingMsg] = useState("");
  const msgs = [
    "Kitna sochogi Kanishka? 😭",
    "Cake pighal jaayega itni der mein 🎂",
    "Tushar wait kar raha hai 👀",
    "Universe bhi confused ho gaya 🌍",
  ];
  return (
    <motion.section {...fadeUp} className="text-center max-w-xl mx-auto">
      <h2 className="font-script text-4xl md:text-5xl text-gradient mb-8">
        Maybe kya hota hai madam? 😭
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onYes} className="btn-cute">
          Okay Yesss 💗
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setThinkingMsg(msgs[Math.floor(Math.random() * msgs.length)])}
          className="glass px-8 py-3.5 rounded-full font-semibold text-plum"
        >
          Still thinking 🤔
        </motion.button>
      </div>
      <AnimatePresence>
        {thinkingMsg && (
          <motion.p
            key={thinkingMsg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-script text-2xl text-rose mt-8"
          >
            {thinkingMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Reveal({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    megaConfetti();
  }, []);
  return (
    <motion.section {...fadeUp} className="text-center max-w-4xl mx-auto relative">
      <Sparkles count={30} />
      {["🎈", "🎈", "🎀", "💗", "🎈"].map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-5xl"
          style={{ left: `${10 + i * 20}%`, top: `${-20}px` }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        >
          {e}
        </motion.span>
      ))}
      <motion.h2
        className="font-display font-semibold text-4xl md:text-7xl text-plum mt-12"
        initial={{ letterSpacing: "0.5em", opacity: 0 }}
        animate={{ letterSpacing: "0.05em", opacity: 1 }}
        transition={{ duration: 1 }}
      >
        HAPPIEST BIRTHDAY
      </motion.h2>
      <motion.h1
        className="font-script text-7xl md:text-9xl text-gradient my-6"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
        style={{ filter: "drop-shadow(0 0 30px rgba(255,105,180,0.6))" }}
      >
        Kanishka 🎀
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="font-script text-2xl md:text-3xl text-plum mb-10"
      >
        Officially a little more amazing today ✨
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="btn-cute"
      >
        There's more 👀
      </motion.button>
    </motion.section>
  );
}

function PhotoMemories({ onNext }: { onNext: () => void }) {
  const [index, setIndex] = useState(0);
  const photo = PHOTOS[index];
  const isLast = index === PHOTOS.length - 1;
  return (
    <motion.section {...fadeUp} className="text-center max-w-3xl mx-auto w-full">
      <h2 className="font-display text-3xl md:text-5xl text-plum mb-2">Memory lane 💗</h2>
      <p className="font-script text-xl text-rose mb-8">
        {index + 1} / {PHOTOS.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, rotate: -8, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, rotate: -2, y: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 8, y: -40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mx-auto bg-white rounded-lg shadow-2xl p-4 pb-16 w-64 md:w-80 relative"
          style={{ boxShadow: "0 25px 60px -15px rgba(200,100,150,0.4)" }}
          whileHover={{ rotate: 0, scale: 1.03 }}
        >
          <div className="w-full aspect-[3/4] rounded bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 grid place-items-center overflow-hidden">
            {photo.src ? (
              <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <div className="text-6xl mb-3">📷</div>
                <p className="font-script text-plum/70 text-sm">
                  Add photo #{index + 1} here
                </p>
              </div>
            )}
          </div>
          <p className="font-script text-xl md:text-2xl text-plum absolute bottom-3 left-0 right-0 text-center">
            {photo.caption}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex gap-3 justify-center flex-wrap">
        {!isLast ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIndex((i) => i + 1)}
            className="btn-cute"
          >
            Next Memory 💗
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="btn-cute"
          >
            Continue <ChevronRight className="inline w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}

function ChoiceGame({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const options = [
    { label: "Unlimited Cake 🎂", msg: "Calories don't count on birthdays. It's science 😌🎂" },
    { label: "Unlimited Happiness 💗", msg: "Ye toh lifetime unlimited honi chahiye 💗" },
    { label: "Unlimited Shopping 🛍️", msg: "Tushar's wallet left the chat 💀😂" },
    { label: "Sab kuch obviously 😌", msg: "Correct answer. Birthday girl privilege 👑" },
  ];
  const chosen = options.find((o) => o.label === selected);

  return (
    <motion.section {...fadeUp} className="text-center max-w-2xl mx-auto">
      <p className="font-script text-2xl text-rose mb-2">Quick birthday test for Kanishka 🎀</p>
      <h2 className="font-display text-3xl md:text-5xl text-plum mb-8">Today you deserve...</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((o) => (
          <motion.button
            key={o.label}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setSelected(o.label);
              burstConfetti();
            }}
            className={`glass rounded-2xl px-6 py-5 font-semibold text-plum text-lg transition-all ${
              selected === o.label ? "ring-2 ring-primary shadow-lg" : ""
            }`}
          >
            {o.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {chosen && (
          <motion.div
            key={chosen.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <p className="font-script text-2xl md:text-3xl text-gradient mb-6">{chosen.msg}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="btn-cute"
            >
              Continue 💗
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Letter({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState(false);
  const [typed, setTyped] = useState("");
  const fullText = `Happy Birthday Kanishka! 🎀

I genuinely hope this year brings you lots of happiness, beautiful memories, and everything you've been wishing for.

Always keep smiling, keep being the amazing person you are, and never let anything dull your sparkle.

May your days be filled with happiness, random laughs, peaceful moments, and people who truly value you.

And haan... aaj ke din thoda extra special feel karna allowed hai 😌

You deserve a really beautiful year ahead.

Once again, Happiest Birthday Kanishka! 💗🎂✨

— Tushar`;

  useEffect(() => {
    if (!opened) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [opened]);

  return (
    <motion.section {...fadeUp} className="text-center max-w-2xl mx-auto w-full">
      <Sparkles count={20} />
      <p className="font-script text-2xl text-blush mb-2">Okay... ab thoda serious 💌</p>
      <h2 className="font-display text-3xl md:text-5xl text-cream mb-8">
        A little message from Tushar
      </h2>

      {!opened ? (
        <>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { duration: 3, repeat: Infinity } }}
            onClick={() => setOpened(true)}
            className="mx-auto w-56 h-40 md:w-72 md:h-52 mb-8 cursor-pointer relative"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-rose-200 via-pink-100 to-purple-100 shadow-2xl">
              <div className="absolute inset-0 grid place-items-center text-6xl md:text-7xl">💌</div>
            </div>
          </motion.div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setOpened(true)} className="btn-cute">
            Read the letter 💗
          </motion.button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: -30 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-2xl p-6 md:p-10 text-left mx-auto"
          style={{ background: "linear-gradient(180deg, rgba(255,240,245,0.95), rgba(255,228,240,0.9))" }}
        >
          <pre className="font-script text-lg md:text-xl text-plum leading-relaxed whitespace-pre-wrap break-words">
            {typed}
            {typed.length < fullText.length && <span className="animate-pulse">|</span>}
          </pre>
          {typed.length >= fullText.length && (
            <div className="text-center mt-6">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="btn-cute"
              >
                Continue 💗
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  );
}

function OneMoreThing({ onNext }: { onNext: () => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <motion.section {...fadeUp} className="text-center max-w-xl mx-auto">
      <h2 className="font-script text-5xl md:text-6xl text-gradient mb-10">Bas? 👀</h2>
      {!msg ? (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMsg("haan")}
            className="glass px-8 py-3.5 rounded-full font-semibold text-plum"
          >
            Haan 😂
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMsg("smart")} className="btn-cute">
            I knew there's more 😌
          </motion.button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {msg === "haan" ? (
            <>
              <p className="font-script text-3xl text-rose mb-3">Wow. Itni jaldi jaa rahi ho? 😭</p>
              <p className="font-script text-2xl text-plum mb-8">Okay okay... ek last surprise 🎀</p>
            </>
          ) : (
            <p className="font-script text-3xl text-gradient mb-8">Smart ho... maan na padega 😌</p>
          )}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNext} className="btn-cute">
            Show me ✨
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
}

function WishJar({ onNext }: { onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const wishes = [
    { label: "Love 💗", msg: "May you be loved as fiercely as you love others 💗" },
    { label: "Success ✨", msg: "Every door you knock on shall open for you ✨" },
    { label: "Peace 🌙", msg: "Calm mornings, quiet nights, a soft-hearted year 🌙" },
    { label: "Adventure 🌍", msg: "New places, unexpected turns, wild beautiful stories 🌍" },
    { label: "Happiness 🌸", msg: "The kind that reaches your eyes and stays there 🌸" },
  ];
  const found = wishes.find((w) => w.label === picked);

  return (
    <motion.section {...fadeUp} className="text-center max-w-3xl mx-auto w-full">
      <Sparkles count={25} />
      <h2 className="font-display text-3xl md:text-5xl text-cream mb-2">The Wish Jar</h2>
      <p className="font-script text-xl md:text-2xl text-blush mb-10">
        Pick a wish for your new year ✨
      </p>

      {!picked ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {wishes.map((w, i) => (
            <motion.button
              key={w.label}
              onClick={() => {
                setPicked(w.label);
                burstConfetti();
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="glass-dark rounded-full h-24 w-24 md:h-28 md:w-28 grid place-items-center text-lg font-semibold text-white p-2 text-center"
              style={{ boxShadow: "0 0 30px rgba(255,182,193,0.5)" }}
            >
              {w.label}
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <SparkIcon className="mx-auto w-12 h-12 text-blush mb-4 animate-pulse" />
          <p className="font-script text-3xl md:text-4xl text-cream mb-4">{found?.msg}</p>
          <p className="font-script text-xl text-blush mb-8">Wish saved for Kanishka ✨</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNext} className="btn-cute">
            Continue 💗
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
}

function CakeSection({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<"wish" | "blow" | "done">("wish");

  return (
    <motion.section {...fadeUp} className="text-center max-w-2xl mx-auto">
      <h2 className="font-display text-3xl md:text-5xl text-plum mb-8">
        {phase === "wish" && "Make a wish, Kanishka 🎂"}
        {phase === "blow" && "Ab candles blow karo 😌"}
        {phase === "done" && "YAYYYYY! 🎉💗"}
      </h2>

      <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 mb-8">
        {/* Cake */}
        <div className="absolute bottom-0 left-0 right-0 mx-auto w-56 md:w-64">
          {/* Candles */}
          <div className="flex justify-center gap-4 mb-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative w-2 h-12 bg-gradient-to-b from-pink-300 to-pink-500 rounded">
                <AnimatePresence>
                  {phase !== "done" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1], y: [-2, 0, -2] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-4 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 50% 60%, #fff3a0, #ffa500 60%, transparent)",
                        boxShadow: "0 0 20px #ffa500",
                      }}
                    />
                  )}
                  {phase === "done" && (
                    <motion.div
                      initial={{ opacity: 0.6, y: 0 }}
                      animate={{ opacity: 0, y: -30 }}
                      transition={{ duration: 1 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg"
                    >
                      💨
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          {/* Top tier */}
          <div className="h-14 rounded-t-lg bg-gradient-to-b from-pink-200 to-pink-300 border-b-4 border-pink-100 shadow-lg" />
          {/* Bottom tier */}
          <div className="h-24 rounded-b-lg bg-gradient-to-b from-purple-200 to-purple-300 border-t-4 border-purple-100 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-3 bg-white/60" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-around">
              {["💗", "🎀", "✨", "🌸", "💗"].map((e, i) => (
                <span key={i} className="text-sm">{e}</span>
              ))}
            </div>
          </div>
          <div className="h-2 bg-plum/30 rounded-b" />
        </div>
      </div>

      {phase === "wish" && (
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPhase("blow")} className="btn-cute">
          I made my wish ✨
        </motion.button>
      )}
      {phase === "blow" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setPhase("done");
            megaConfetti();
          }}
          className="btn-cute"
        >
          Blow Candles 💨
        </motion.button>
      )}
      {phase === "done" && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNext} className="btn-cute">
          One last thing 💗
        </motion.button>
      )}
    </motion.section>
  );
}

function FinalScreen({ onReplay, onLast }: { onReplay: () => void; onLast: () => void }) {
  useEffect(() => {
    burstConfetti();
  }, []);
  return (
    <motion.section {...fadeUp} className="text-center max-w-3xl mx-auto relative">
      <Sparkles count={40} />
      {["🎈", "🎀", "💗", "✨", "🌸", "🎈"].map((e, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl md:text-5xl"
          style={{ left: `${5 + i * 16}%`, top: `-20px` }}
          animate={{ y: [0, -20, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
        >
          {e}
        </motion.span>
      ))}

      <motion.h1
        className="font-script text-6xl md:text-8xl text-gradient mt-16 mb-6"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{ filter: "drop-shadow(0 0 25px rgba(255,105,180,0.5))" }}
      >
        Happy Birthday, Kanishka 🎀
      </motion.h1>
      <p className="font-display italic text-xl md:text-3xl text-plum mb-3">
        May this chapter of your life be your prettiest one yet ✨
      </p>
      <p className="font-script text-2xl md:text-3xl text-rose mb-10">
        Keep smiling. It looks good on you 💗
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onReplay} className="glass px-8 py-3.5 rounded-full font-semibold text-plum">
          <RotateCcw className="inline w-4 h-4 mr-2" />Replay the Surprise
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onLast} className="btn-cute">
          One Last Click 👀
        </motion.button>
      </div>

      <div className="mt-16 pt-8 border-t border-plum/20">
        <p className="text-sm text-plum/70">
          Made with lots of effort, a little love magic ✨ and good wishes
        </p>
        <p className="font-script text-2xl text-gradient mt-2">— Tushar 💗</p>
      </div>
    </motion.section>
  );
}

function LastClick({ onReplay }: { onReplay: () => void }) {
  useEffect(() => {
    heartExplosion();
    setTimeout(heartExplosion, 400);
    setTimeout(heartExplosion, 800);
    megaConfetti();
  }, []);
  return (
    <motion.section {...fadeUp} className="text-center max-w-3xl mx-auto">
      <p className="font-script text-3xl md:text-4xl text-plum mb-4">Once again...</p>
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="font-display font-bold text-4xl md:text-6xl text-gradient mb-6"
        style={{ filter: "drop-shadow(0 0 30px rgba(255,105,180,0.6))" }}
      >
        HAPPIEST BIRTHDAY KANISHKA! 🎂🎀💗
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="font-script text-2xl md:text-3xl text-rose mb-10"
      >
        Now go enjoy your day, Birthday Girl 👑✨
      </motion.p>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onReplay} className="btn-cute">
        <RotateCcw className="inline w-4 h-4 mr-2" />Replay from start
      </motion.button>
    </motion.section>
  );
}
