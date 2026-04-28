// Reveal on scroll
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(e => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach(e => io.observe(e));
})();

// Live clock in topbar (KST)
(function () {
  const el = document.querySelector("[data-clock]");
  if (!el) return;
  function tick() {
    const d = new Date();
    const opts = { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul" };
    el.textContent = "Seoul · " + d.toLocaleTimeString("en-GB", opts);
  }
  tick();
  setInterval(tick, 1000 * 30);
})();
