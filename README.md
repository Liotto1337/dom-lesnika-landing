# Дом лесника — демо-лендинг

Демо-сайт базы отдыха: только дизайн и фронтенд, без бекенда. Первый экран — живая
3D-сцена (холм с травой, домик лесника, ели, облака, день / закат / ночь), ниже — страница
в оливково-золотой палитре.

Стек: Next.js 16 (статический экспорт), React 19, three.js + react-three-fiber + drei,
GSAP (ScrollTrigger), Lenis.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # статический сайт в out/ — его можно залить на любой хостинг
npm start          # раздать out/ на http://localhost:4321
```

## Тесты

```bash
npm test           # юнит-тесты (Vitest): пресеты времени суток, таймер
npm run e2e        # e2e (Playwright, Chromium с программным WebGL): сам собирает и раздаёт out/
```

В e2e страница открывается как `/?blades=2000` — программный WebGL не тянет 60 000 травинок.
Параметр `?blades=N` можно использовать и вручную; `?debug` выставляет `window.__debug` для тестов.

## Где что менять

| Что | Где |
|---|---|
| Все тексты, цены, карточки, контакты | `content/site.ts` |
| Фото | `public/images/` (имена — в `CREDITS.md`), скачать заново: `scripts/fetch-images.sh` |
| Палитра и общие стили | `app/globals.css` (переменные `--bg`, `--line`, …) |
| Цвета неба, свет, трава по времени суток | `components/hero/timeOfDay.ts` (`PRESETS`) |
| Форма холма, камера | `components/hero/sceneMath.ts` |
| Домик, ели | `components/hero/Cabin.tsx`, `components/hero/Trees.tsx` |
| Трава (шейдер) | `components/hero/Grass.tsx`, `components/hero/grassShader.ts` |
| Золотая линия в «О нас» | `components/sections/About.tsx` (`LINE`) |

## Устройство

- `components/SmoothScroll.tsx` — Lenis на тикере GSAP, `scrollToId()` для якорей.
- `components/hero/` — первый экран: `Hero.tsx` (интерфейс, режим «Подышать лесом»),
  `SceneMount.tsx` (проверка WebGL, иначе `SceneFallback`), `HeroScene.tsx` (сцена),
  `usePreset.tsx` (плавный переход между временами суток).
- `components/sections/` — секции страницы, `components/ui/` — `Reveal`, `GoldLine`.

Скрипты для скриншотов: `scripts/shot.mjs`, `scripts/shot-full.mjs`, `scripts/shot-grass.mjs`,
замер FPS — `scripts/fps.mjs`.
