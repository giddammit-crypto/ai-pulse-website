/**
 * AI PULSE — 3D CARD TILT & PARALLAX ENGINE
 * Adds interactive 3D perspective tilt to glass cards on hover.
 */

export function init3DCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.featured-card, .news-card, .stat-box');

  cards.forEach((card) => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      document.addEventListener('mousemove', onMouseMove);
    }

    function onMouseMove(e) {
      if (!bounds) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
      };

      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

      card.style.transform = `
        perspective(1000px)
        scale3d(1.02, 1.02, 1.02)
        rotateX(${-center.y / 25}deg)
        rotateY(${center.x / 25}deg)
        translateZ(10px)
      `;
    }

    function onMouseLeave() {
      document.removeEventListener('mousemove', onMouseMove);
      card.style.transform = '';
      card.style.background = '';
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}
