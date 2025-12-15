/* ===== Theme toggle (dark mode) ===== */
(function () {
  const storageKey = "devin_theme";
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  function setTheme(mode) {
    root.dataset.theme = mode;
    try { localStorage.setItem(storageKey, mode); } catch {}
    if (btn) {
      const icon = btn.querySelector("i");
      const label = btn.querySelector("span");
      if (mode === "dark") {
        icon.className = "fa-solid fa-sun";
        label.textContent = "Light";
      } else {
        icon.className = "fa-solid fa-moon";
        label.textContent = "Dark";
      }
    }
  }

  // Init theme
  const saved = (() => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  })();
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));

  if (btn) {
    btn.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }
})();

/* ===== Scroll reveal animations ===== */
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("reveal-in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("reveal-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => io.observe(el));
})();

/* ===== Certification modal ===== */
function openCert(card) {
  const modal = document.getElementById("certModal");
  const img = document.getElementById("modalImg");
  const title = document.getElementById("modalTitle");
  const desc = document.getElementById("modalDesc");
  const tagsWrap = document.getElementById("modalTags");

  if (!modal || !img || !title || !desc || !tagsWrap) return;

  const cardImg = card.querySelector("img");
  const t = card.dataset.title || card.querySelector("h3")?.textContent || "Certificate";
  const d = card.dataset.desc || card.querySelector("p")?.textContent || "";
  const tags = (card.dataset.tags || "").split(",").map(s => s.trim()).filter(Boolean);

  img.src = cardImg ? cardImg.src : "";
  title.textContent = t;
  desc.textContent = d;

  tagsWrap.innerHTML = "";
  tags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    tagsWrap.appendChild(span);
  });

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  // Close on Escape
  document.addEventListener("keydown", escClose, { once: true });
  function escClose(e) { if (e.key === "Escape") closeCert(); }
}

function closeCert() {
  const modal = document.getElementById("certModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Click outside to close
document.addEventListener("click", (e) => {
  const modal = document.getElementById("certModal");
  if (!modal || !modal.classList.contains("open")) return;
  if (e.target === modal) closeCert();
});
