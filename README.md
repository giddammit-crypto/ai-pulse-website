# 🚀 AI PULSE — Горизонт Событий Искусственного Интеллекта

[![Deploy to GitHub Pages](https://github.com/giddammit-crypto/ai-pulse-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/giddammit-crypto/ai-pulse-website/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![WebGL: Three.js](https://img.shields.io/badge/3D-Three.js-00F0FF.svg)](https://threejs.org/)
[![Animations: GSAP](https://img.shields.io/badge/Animations-GSAP%20%2B%20Lenis-8B31FF.svg)](https://greensock.com/)

> **AI PULSE** — футуристический веб-портал нового поколения, посвященный фронтиру искусственного интеллекта, LLM, Computer Vision, робототехнике и квантовым вычислениям. Сайт спроектирован как живой организм с интерактивной 3D-визуализацией **«Горизонт Событий»** на Three.js, кинетической типографикой и автоматическим обновлением новостей через GitHub Actions.

---

## 🌌 Концепция: «Горизонт Событий» (Event Horizon)

Искусственный интеллект подобен космической сингулярности: он аккумулирует знание цивилизации, искривляет технологическое пространство и формирует новую цифровую эру. 

- **Центральное ядро:** Абсолютная черная дыра (Event Horizon Void) с гравитационным кольцом Эйнштейна и фотонной сферой.
- **Релятивистский аккреционный диск:** Тысячи частиц вращаются по законам Кеплера с эффектом Доплера (набегающий край ярче).
- **Синаптическая нейронная сеть:** Более 3,600 динамических частиц в 3D-пространстве с гравитационным притяжением и реакцией на курсор мыши.
- **Релятивистские джеты:** Квантовые энергетические потоки, пульсирующие вдоль оси вращения сингулярности.
- **Интерактивные цветовые спектры:** 
  - `Horizon` — плазменный оранжево-золотой аккреционный спектр.
  - `Quantum` — неоново-голубой и индиго квантовый импульс.
  - `Matrix` — био-люминесцентная зеленая цифровая матрица.

---

## ✨ Основные возможности и архитектура

| Секция / Фича | Описание |
| :--- | :--- |
| **#hero** | 3D WebGL сцена + кинетическая типографика + панель телеметрии параметров топ-моделей |
| **#ticker** | Бегущая кибер-строка с экстренными заголовками и статусом синхронизации |
| **#featured** | Топ-3 главные аналитические статьи с эффектом 3D tilt и стеклянными бейджами |
| **#news-grid-section** | Динамическая сетка новостей с фильтрами по категориям (LLM, Vision, Robotics, Research, Industry) и живым поиском |
| **#stats** | Анимированные счетчики масштабов роста индустрии (параметры моделей, FLOPs, темп публикаций arXiv) |
| **#singularity-lab** | Интерактивный пульт управления 3D-физикой сцены: скорость вращения диска, плотность частиц, гравитационное искривление, импульс сингулярности |
| **Reader Modal** | Встроенное модальное окно быстрого чтения с возможностью поделиться и перехода к первоисточнику |
| **Web Audio Ambient** | Процедурный генератор глубокого космического эмбиента на Web Audio API (без внешних аудиофайлов) |
| **Smooth Parallax** | 5-слойный параллакс на GSAP ScrollTrigger и Lenis smooth scroll |
| **Custom Cursor** | Реактивный неоновый курсор с магнитным поведением при наведении на интерактивные элементы |

---

## 🛠️ Технический стек

- **Сборщик:** [Vite](https://vitejs.dev/)
- **3D & WebGL:** [Three.js](https://threejs.org/) (Custom ShaderMaterial, BufferGeometry, Doppler beaming, Particle System)
- **Анимации:** [GSAP 3](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Плавный скролл:** [Lenis](https://lenis.darkroom.engineering/)
- **Стилизация:** Чистый CSS3, Custom Properties, Glassmorphism, CSS View-Timeline
- **Данные:** JSON кэш + автономный парсер `scripts/fetch-news.js`
- **CI/CD:** GitHub Actions (автоматический деплой на GitHub Pages и обновление новостей каждые 6 часов)

---

## 🚀 Локальный запуск

1. **Клонировать репозиторий:**
   ```bash
   git clone https://github.com/giddammit-crypto/ai-pulse-website.git
   cd ai-pulse-website
   ```

2. **Установить зависимости:**
   ```bash
   npm install
   ```

3. **Запустить сервер разработки:**
   ```bash
   npm run dev
   ```
   Сервер запустится по адресу `http://localhost:3000`.

4. **Обновить ленту новостей:**
   ```bash
   npm run fetch-news
   ```

5. **Собрать production-билд:**
   ```bash
   npm run build
   ```

---

## 🤖 Автоматизация GitHub Actions

- `.github/workflows/deploy.yml` — автоматически собирает и публикует сайт на GitHub Pages при каждом пуше в ветку `main`.
- `.github/workflows/update-news.yml` — запускается по cron-расписанию каждые 6 часов, актуализирует `data/news.json` и пушит изменения в репозиторий.

---

## 📄 Лицензия

Распространяется под лицензией MIT.
