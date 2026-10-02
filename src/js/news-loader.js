import { animateNewsCards } from './animations.js';

/**
 * AI PULSE — DYNAMIC NEWS LOADER & INTERACTION ENGINE
 * Manages news fetching, filtering, search, category counts, and modal reader.
 */

let allArticles = [];
let currentCategory = 'all';
let searchQuery = '';

export async function initNewsLoader() {
  try {
    // Attempt to load from public data directory
    const response = await fetch('./data/news.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    allArticles = data.articles || [];
  } catch (err) {
    console.warn('Failed to load external news.json, using fallback data', err);
    // Fallback in-memory dataset if fetched over file:// or offline
    allArticles = getFallbackArticles();
  }

  // Update DOM components
  updateCategoryCounts();
  renderTicker();
  renderFeatured();
  renderNewsGrid();
  setupFilterEvents();
  setupSearchEvent();
  setupModalEvents();
  setupNewsletterEvent();
}

/**
 * Update numbers inside category filter tabs
 */
function updateCategoryCounts() {
  const counts = {
    all: allArticles.length,
    LLM: 0,
    Vision: 0,
    Robotics: 0,
    Research: 0,
    Industry: 0,
  };

  allArticles.forEach((art) => {
    if (counts[art.category] !== undefined) {
      counts[art.category]++;
    }
  });

  const countAll = document.getElementById('count-all');
  const countLlm = document.getElementById('count-llm');
  const countVision = document.getElementById('count-vision');
  const countRobo = document.getElementById('count-robotics');
  const countRes = document.getElementById('count-research');
  const countInd = document.getElementById('count-industry');

  if (countAll) countAll.textContent = counts.all;
  if (countLlm) countLlm.textContent = counts.LLM;
  if (countVision) countVision.textContent = counts.Vision;
  if (countRobo) countRobo.textContent = counts.Robotics;
  if (countRes) countRes.textContent = counts.Research;
  if (countInd) countInd.textContent = counts.Industry;
}

/**
 * Populate continuous cyber ticker
 */
function renderTicker() {
  const track = document.getElementById('ticker-track');
  if (!track || !allArticles.length) return;

  const tickerItems = allArticles.map((art) => `
    <a href="#news-grid-section" class="ticker-item" data-id="${art.id}">
      <span class="ticker-badge">${art.category}</span>
      <span>${escapeHtml(art.title)}</span>
      <span class="ticker-dot"></span>
    </a>
  `).join('');

  // Duplicate stream to ensure seamless infinite looping animation
  track.innerHTML = tickerItems + tickerItems;

  track.querySelectorAll('.ticker-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      const id = item.dataset.id;
      const article = allArticles.find(a => a.id === id);
      if (article) {
        openArticleModal(article);
      }
    });
  });
}

/**
 * Render Top-3 Featured Stories
 */
function renderFeatured() {
  const container = document.getElementById('featured-grid');
  if (!container) return;

  const featuredList = allArticles.filter(a => a.featured).slice(0, 3);
  if (!featuredList.length) return;

  const primary = featuredList[0];
  const secondary = featuredList[1] || allArticles[1];
  const tertiary = featuredList[2] || allArticles[2];

  let html = '';

  if (primary) {
    html += `
      <article class="featured-card primary" data-id="${primary.id}">
        <div class="card-media">
          <img src="${primary.image}" alt="${escapeHtml(primary.title)}" class="card-img" loading="lazy">
          <div class="card-media-overlay"></div>
          <div class="card-badge-floating">
            <span class="category-tag ${primary.category.toLowerCase()}">${primary.category}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="source-name">${escapeHtml(primary.source)}</span>
            <span>•</span>
            <span>${primary.date}</span>
            <span>•</span>
            <span>4 мин чтения</span>
          </div>
          <h3 class="card-title">${escapeHtml(primary.title)}</h3>
          <p class="card-summary">${escapeHtml(primary.summary)}</p>
          <div class="card-footer">
            <div class="card-tags">
              ${primary.tags.map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('')}
            </div>
            <span class="card-read-more">
              Читать анализ
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </article>
    `;
  }

  if (secondary) {
    html += `
      <article class="featured-card secondary" data-id="${secondary.id}">
        <div class="card-media">
          <img src="${secondary.image}" alt="${escapeHtml(secondary.title)}" class="card-img" loading="lazy">
          <div class="card-media-overlay"></div>
          <div class="card-badge-floating">
            <span class="category-tag ${secondary.category.toLowerCase()}">${secondary.category}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="source-name">${escapeHtml(secondary.source)}</span>
            <span>•</span>
            <span>${secondary.date}</span>
          </div>
          <h3 class="card-title">${escapeHtml(secondary.title)}</h3>
          <p class="card-summary">${escapeHtml(secondary.summary)}</p>
          <div class="card-footer">
            <div class="card-tags">
              ${secondary.tags.map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('')}
            </div>
            <span class="card-read-more">
              Инсайт
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </article>
    `;
  }

  if (tertiary) {
    html += `
      <article class="featured-card tertiary" data-id="${tertiary.id}">
        <div class="card-media" style="height: 100%;">
          <img src="${tertiary.image}" alt="${escapeHtml(tertiary.title)}" class="card-img" loading="lazy">
          <div class="card-media-overlay"></div>
          <div class="card-badge-floating">
            <span class="category-tag ${tertiary.category.toLowerCase()}">${tertiary.category}</span>
          </div>
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="source-name">${escapeHtml(tertiary.source)}</span>
            <span>•</span>
            <span>${tertiary.date}</span>
          </div>
          <h3 class="card-title">${escapeHtml(tertiary.title)}</h3>
          <p class="card-summary">${escapeHtml(tertiary.summary)}</p>
          <div class="card-footer">
            <div class="card-tags">
              ${tertiary.tags.map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('')}
            </div>
            <span class="card-read-more">
              Спецматериал
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      </article>
    `;
  }

  container.innerHTML = html;

  container.querySelectorAll('.featured-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const article = allArticles.find(a => a.id === id);
      if (article) openArticleModal(article);
    });
  });
}

/**
 * Filter and Render Main News Grid
 */
function renderNewsGrid() {
  const container = document.getElementById('news-grid');
  if (!container) return;

  const filtered = allArticles.filter((art) => {
    const matchesCategory = currentCategory === 'all' || art.category === currentCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.source.toLowerCase().includes(q) ||
      art.tags.some(t => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--glass-bg); border-radius: var(--radius-lg); border: 1px dashed var(--glass-border);">
        <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 8px;">Сигналов по запросу не обнаружено</p>
        <p style="font-size: 0.88rem; color: var(--text-muted);">Попробуйте изменить категорию или поисковые ключевые слова.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((art) => `
    <article class="news-card" data-id="${art.id}">
      <div class="card-media">
        <img src="${art.image}" alt="${escapeHtml(art.title)}" class="card-img" loading="lazy">
        <div class="card-media-overlay"></div>
        <div class="card-badge-floating">
          <span class="category-tag ${art.category.toLowerCase()}">${art.category}</span>
        </div>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="source-name">${escapeHtml(art.source)}</span>
          <span>•</span>
          <span>${art.date}</span>
        </div>
        <h4 class="card-title">${escapeHtml(art.title)}</h4>
        <p class="card-summary">${escapeHtml(art.summary)}</p>
        <div class="card-footer">
          <div class="card-tags">
            ${art.tags.slice(0, 3).map(t => `<span class="tag-pill">#${escapeHtml(t)}</span>`).join('')}
          </div>
          <span class="card-read-more">
            Обзор
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.news-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const article = allArticles.find(a => a.id === id);
      if (article) openArticleModal(article);
    });
  });

  // Re-animate newly mounted cards with GSAP
  animateNewsCards();

  // Notify cursor and 3D card tilt handlers
  window.dispatchEvent(new CustomEvent('newsRendered'));
}

/**
 * Filter Tabs Event Handling
 */
function setupFilterEvents() {
  const tabs = document.querySelectorAll('.cat-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      renderNewsGrid();
    });
  });

  // Handle footer category links
  document.querySelectorAll('[data-filter]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const cat = link.dataset.filter;
      const targetTab = document.querySelector(`.cat-tab[data-category="${cat}"]`);
      if (targetTab) {
        tabs.forEach(t => t.classList.remove('active'));
        targetTab.classList.add('active');
        currentCategory = cat;
        renderNewsGrid();
      }
    });
  });
}

/**
 * Search Box Input Debounced Handler
 */
function setupSearchEvent() {
  const input = document.getElementById('news-search-input');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value;
      renderNewsGrid();
    }, 180);
  });
}

/**
 * Article Reader Modal
 */
let activeModalArticle = null;

function openArticleModal(article) {
  activeModalArticle = article;

  const modal = document.getElementById('article-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCat = document.getElementById('modal-cat');
  const modalSource = document.getElementById('modal-source');
  const modalDate = document.getElementById('modal-date');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalLink = document.getElementById('modal-link');

  if (!modal) return;

  modalImg.src = article.image;
  modalImg.alt = article.title;
  modalCat.textContent = article.category;
  modalCat.className = `category-tag ${article.category.toLowerCase()}`;
  modalSource.textContent = article.source;
  modalDate.textContent = article.date;
  modalTitle.textContent = article.title;
  modalText.textContent = article.content || article.summary;
  modalLink.href = article.url || '#';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('article-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function setupModalEvents() {
  const modal = document.getElementById('article-modal');
  const closeBtn = document.getElementById('modal-close');
  const shareBtn = document.getElementById('modal-share');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeArticleModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeArticleModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeArticleModal();
    }
  });

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (!activeModalArticle) return;

      if (navigator.share) {
        try {
          await navigator.share({
            title: activeModalArticle.title,
            text: activeModalArticle.summary,
            url: window.location.href,
          });
        } catch (err) {
          console.log('Share canceled');
        }
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = `<span>Ссылка скопирована!</span>`;
        setTimeout(() => {
          shareBtn.innerHTML = originalText;
        }, 2000);
      }
    });
  }
}

/**
 * Newsletter Form Simulation with visual status feedback
 */
function setupNewsletterEvent() {
  const form = document.getElementById('newsletter-form');
  const status = document.getElementById('newsletter-status');

  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const email = input.value.trim();

    if (email) {
      status.style.display = 'block';
      status.style.color = 'var(--accent-green)';
      status.textContent = `✓ [СИНГУЛЯРНОСТЬ ПОДКЛЮЧЕНА] Квантовый дайджест будет направлен на ${email}`;
      input.value = '';

      setTimeout(() => {
        status.style.display = 'none';
      }, 6000);
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getFallbackArticles() {
  return [
    {
      id: "fallback-deepseek",
      title: "DeepSeek и открытые архитектуры: Новая эра рассуждений",
      summary: "Исследователи открыли веса моделей с самопроверкой рассуждений.",
      category: "LLM",
      tags: ["DeepSeek", "Reasoning"],
      source: "Hugging Face",
      url: "https://huggingface.co/blog",
      date: "2026-10-02",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
      featured: true,
      content: "Полный анализ трендов test-time compute и открытых весов."
    }
  ];
}
