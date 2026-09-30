/* Theme toggle. Respects the OS setting until the visitor overrides it,
   then remembers the override. Runs early to avoid a flash of the wrong theme. */
(function () {
  var root = document.documentElement;
  var KEY = "dj-theme";

  /* Marks that scripts run, so the CSS can collapse the menus on small screens.
     Without it the nav and sidebar links simply stay visible. */
  root.className += " js";

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
  if (stored === "dark" || stored === "light") root.setAttribute("data-theme", stored);

  function current() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function paint(btn) {
    var isDark = current() === "dark";
    btn.textContent = isDark ? "☀" : "☾";
    btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }

  /* Small-screen dropdowns: the nav menu and the sidebar "Links" list. */
  function dropdown(btn, panel) {
    if (!btn || !panel) return;
    function set(open) {
      panel.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      set(!panel.classList.contains("is-open"));
    });
    document.addEventListener("click", function (e) {
      if (!panel.contains(e.target)) set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") set(false);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    dropdown(document.querySelector(".nav-toggle"), document.querySelector(".site-nav__links"));
    dropdown(document.querySelector(".author__urls-toggle"), document.querySelector(".author__urls"));

    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    paint(btn);
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
      paint(btn);
    });
  });
})();
