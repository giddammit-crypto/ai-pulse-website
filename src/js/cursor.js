/**
 * AI PULSE — CUSTOM CYBER CURSOR
 * Smooth follower circle with interactive magnetic hover states and click pulses.
 */

export function initCursor() {
  // Disable on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const cursor = document.getElementById('cyber-cursor');
  const follower = document.getElementById('cyber-cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  let isHovering = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant position for inner dot
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) ${isHovering ? 'scale(1.5)' : 'scale(1)'}`;
  }, { passive: true });

  // Smooth lag for outer follower circle
  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover detection for interactive elements
  function setupHoverListeners() {
    const interactives = document.querySelectorAll('a, button, input, .news-card, .featured-card, .stat-box, .mode-btn, .cat-tab');

    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        isHovering = true;
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
      });

      el.addEventListener('mouseleave', () => {
        isHovering = false;
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });
  }

  setupHoverListeners();

  // Re-run listener setup when new cards are dynamically rendered
  window.addEventListener('newsRendered', () => {
    setupHoverListeners();
  });

  // Click burst animation
  window.addEventListener('mousedown', () => {
    follower.style.transform += ' scale(0.8)';
  });
  window.addEventListener('mouseup', () => {
    follower.style.transform = follower.style.transform.replace(' scale(0.8)', '');
  });
}
