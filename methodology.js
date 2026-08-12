(() => {
  const progress = document.getElementById("readingProgress");
  const printButton = document.getElementById("printButton");
  const tocButton = document.getElementById("tocButton");
  const toc = document.getElementById("tableOfContents");
  const tocLinks = [...document.querySelectorAll(".toc-list a")];
  const chapters = [...document.querySelectorAll(".chapter[id]")];

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  const closeToc = () => {
    toc.classList.remove("open");
    document.body.classList.remove("toc-open");
    tocButton.setAttribute("aria-expanded", "false");
    tocButton.setAttribute("aria-label", "打开章节目录");
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  printButton.addEventListener("click", () => window.print());

  tocButton.addEventListener("click", () => {
    const isOpen = toc.classList.toggle("open");
    document.body.classList.toggle("toc-open", isOpen);
    tocButton.setAttribute("aria-expanded", String(isOpen));
    tocButton.setAttribute("aria-label", isOpen ? "关闭章节目录" : "打开章节目录");
  });

  tocLinks.forEach((link) => link.addEventListener("click", closeToc));

  const observer = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;
    tocLinks.forEach((link) => {
      const matches = link.getAttribute("href") === `#${active.target.id}`;
      link.classList.toggle("active", matches);
      if (matches) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }, {
    rootMargin: "-18% 0px -68% 0px",
    threshold: [0, 0.15, 0.35],
  });

  chapters.forEach((chapter) => observer.observe(chapter));
})();
