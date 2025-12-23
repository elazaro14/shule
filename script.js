// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleTheme");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      document.body.classList.toggle("light", next === "light");
    });
  }

  // Mark active nav link
  const nav = document.querySelectorAll(".nav a");
  const here = location.pathname.split("/").pop() || "index.html";
  nav.forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
});
