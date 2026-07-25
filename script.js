const PORTFOLIO_CONFIG = {
  name: "Carlos",
  socials: {
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroName = document.querySelector("#heroName");
const heroGroup = document.querySelector("#heroGroup");
const nameAura = document.querySelector("#nameAura");
const socials = document.querySelector("#socials");
const flashBurst = document.querySelector("#flashBurst");
const beamPrimary = document.querySelector("#beamPrimary");
const beamSecondary = document.querySelector("#beamSecondary");

let letterElements = [];
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

function buildNameMarkup(name) {
  const fragment = document.createDocumentFragment();

  for (const character of name) {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = character;
    span.setAttribute("aria-hidden", "true");

    if (character === " ") {
      span.innerHTML = "&nbsp;";
    }

    fragment.appendChild(span);
  }

  heroName.textContent = "";
  heroName.appendChild(fragment);
  heroName.setAttribute("aria-label", name);
  document.title = `${name} | Cinematic Portfolio`;
  letterElements = Array.from(heroName.querySelectorAll(".letter"));
}

function applySocialLinks() {
  const links = document.querySelectorAll(".social-link");

  links.forEach((link) => {
    const platform = link.dataset.platform;
    if (platform && PORTFOLIO_CONFIG.socials[platform]) {
      link.href = PORTFOLIO_CONFIG.socials[platform];
    }
  });
}

function animateIntro() {
  gsap.set(heroGroup, { opacity: 1, scale: 0.985 });
  gsap.set(heroName, { opacity: 1 });
  gsap.set(letterElements, { yPercent: 16, opacity: 0.08 });
  gsap.set(nameAura, { opacity: 0.08, scale: 0.78 });
  gsap.set(socials, { opacity: 0, y: 26 });
  gsap.set(flashBurst, { opacity: 0, scale: 0.9 });
  gsap.set([beamPrimary, beamSecondary], { opacity: (_, target) => (target === beamPrimary ? 0.08 : 0.04) });

  const timeline = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  if (reducedMotion) {
    timeline
      .to([beamPrimary, beamSecondary], { opacity: (_, target) => (target === beamPrimary ? 0.16 : 0.08), duration: 0.7 })
      .to(
        letterElements,
        {
          yPercent: 0,
          opacity: 1,
          color: "rgba(255,255,255,0.96)",
          textShadow: "0 0 14px rgba(255,255,255,0.34), 0 0 28px rgba(255,255,255,0.08)",
          duration: 0.45,
          stagger: 0.04,
        },
        0.1,
      )
      .to(
        [heroGroup, nameAura],
        {
          scale: (_, target) => (target === heroGroup ? 1 : 0.94),
          opacity: (_, target) => (target === heroGroup ? 1 : 0.18),
          duration: 0.45,
        },
        ">-0.05",
      )
      .to(
        socials,
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
        },
        "-=0.1",
      );

    return timeline;
  }

  timeline
    .to([beamPrimary, beamSecondary], {
      opacity: (_, target) => (target === beamPrimary ? 0.22 : 0.12),
      duration: 1.2,
      ease: "sine.inOut",
    })
    .to(
      nameAura,
      {
        opacity: 0.14,
        scale: 0.92,
        duration: 1.3,
        ease: "sine.out",
      },
      0.2,
    )
    .to(
      letterElements,
      {
        yPercent: 0,
        opacity: 1,
        color: "rgba(255,255,255,0.98)",
        textShadow: "0 0 18px rgba(255,255,255,0.48), 0 0 42px rgba(255,255,255,0.12)",
        duration: 0.52,
        stagger: 0.085,
      },
      0.6,
    )
    .to(
      heroGroup,
      {
        scale: 1.1,
        duration: 1.15,
        ease: "power2.inOut",
      },
      ">-0.08",
    )
    .to(
      nameAura,
      {
        opacity: 0.34,
        scale: 1.18,
        duration: 1.05,
        ease: "power2.out",
      },
      "<",
    )
    .to(
      flashBurst,
      {
        opacity: 0.82,
        scale: 1.12,
        duration: 0.22,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.28",
    )
    .to(
      heroGroup,
      {
        scale: 1,
        duration: 1.1,
        ease: "expo.out",
      },
      ">-0.05",
    )
    .to(
      nameAura,
      {
        opacity: 0.16,
        scale: 0.92,
        duration: 1.2,
        ease: "expo.out",
      },
      "<",
    )
    .to(
      socials,
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.55",
    );

  return timeline;
}

function startIdleMotion() {
  if (!reducedMotion) {
    gsap.to(nameAura, {
      opacity: 0.2,
      scale: 0.98,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  const tick = () => {
    const time = performance.now() * 0.00022;
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    const nameX = currentX * 10;
    const nameY = currentY * 8;
    const beamX = currentX * 28 + Math.sin(time) * 10;
    const beamY = currentY * 18 + Math.cos(time * 0.9) * 6;
    const beamXSecondary = currentX * 18 - Math.sin(time * 0.8) * 8;
    const beamYSecondary = currentY * 12 + Math.cos(time * 0.7) * 5;

    heroGroup.style.transform = `translate3d(${nameX.toFixed(2)}px, ${nameY.toFixed(2)}px, 0) scale(1)`;
    beamPrimary.style.transform = `rotate(-16deg) translate3d(${beamX.toFixed(2)}px, ${beamY.toFixed(2)}px, 0)`;
    beamSecondary.style.transform = `rotate(-16deg) translate3d(${beamXSecondary.toFixed(2)}px, ${beamYSecondary.toFixed(2)}px, 0)`;

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function bindPointerMotion() {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    targetX = x;
    targetY = y;
  });

  window.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  });
}

function init() {
  buildNameMarkup(PORTFOLIO_CONFIG.name);
  applySocialLinks();
  animateIntro().eventCallback("onComplete", startIdleMotion);
  bindPointerMotion();
}

init();
