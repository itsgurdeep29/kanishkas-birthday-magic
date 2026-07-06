import confetti from "canvas-confetti";

export function burstConfetti() {
  const colors = ["#ffb6c1", "#ffc0cb", "#e6a8d7", "#d8bfd8", "#fff0f5", "#ff69b4"];
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
  setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors }), 200);
  setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors }), 400);
}

export function megaConfetti() {
  const colors = ["#ffb6c1", "#ffc0cb", "#e6a8d7", "#d8bfd8", "#fff0f5", "#ff69b4", "#ffd700"];
  const end = Date.now() + 2500;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 80, origin: { x: 0 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 80, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function heartExplosion() {
  const scalar = 2;
  const heart = confetti.shapeFromText({ text: "💗", scalar });
  confetti({
    particleCount: 60,
    spread: 100,
    origin: { y: 0.5 },
    shapes: [heart],
    scalar,
  });
}
