# IntelKadr Next.js Prototype

Демо-прототип платформы проверки документов и антифрода для ТЭК.

## Что установить

Рекомендуемая база:

1. Node.js 20 LTS
2. npm 10+ или pnpm 9+
3. VS Code
4. Расширения: ESLint, TypeScript, Tailwind CSS IntelliSense (если позже добавите Tailwind)

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть: http://localhost:3000

## Почему эти библиотеки

- `next` + `react` — основной каркас демо.
- `recharts` — быстрые и понятные продуктовые графики для dashboard.
- `echarts` + `echarts-for-react` — более выразительные аналитические визуализации и риск-диаграммы.
- `zustand` — легкое state management для фильтров, wizard-state и mock workflow.
- `typescript` — безопасная структура проекта.
- `eslint` + `eslint-config-next` — базовый контроль качества.

## Рекомендуемая следующая установка

Если захотите усилить UX после базового прототипа, можно добавить:

```bash
npm i framer-motion react-dropzone lucide-react
```

- `framer-motion` — анимации и transitions
- `react-dropzone` — drag-and-drop загрузка файлов
- `lucide-react` — аккуратные иконки

## Структура

- `app/` — маршруты dashboard, check, candidates, explain
- `components/` — UI и доменные блоки
- `lib/data.ts` — моковые данные для демо
