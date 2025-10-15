# Autoservice Project

Професійний веб-сайт автосервісу з підтримкою української та англійської мов.

## 🚀 Технології

- **Next.js 15** - React фреймворк з App Router
- **Material-UI (MUI)** - UI компоненти
- **next-intl** - Інтернаціоналізація (EN/UK)
- **TypeScript** - Типізація
- **Emotion** - CSS-in-JS

## 📁 Структура проекту

```
src/
├── app/
│   ├── [locale]/          # Локалізовані сторінки
│   │   ├── about/         # Про нас
│   │   ├── blog/          # Блог
│   │   ├── contact/       # Контакти
│   │   ├── services/      # Послуги
│   │   └── works/         # Наші роботи
│   └── layout.tsx         # Кореневий layout
├── components/            # React компоненти
├── i18n.ts               # Конфігурація локалізації
└── middleware.ts         # Next.js middleware
```

## 🛠 Встановлення та запуск

1. **Клонування репозиторію:**
```bash
git clone https://github.com/Dribnuy/AutoserviceProject.git
cd AutoserviceProject
```

2. **Встановлення залежностей:**
```bash
npm install
```

3. **Запуск в режимі розробки:**
```bash
npm run dev
```

4. **Відкрийте браузер:**
- Українська: [http://localhost:3000/uk](http://localhost:3000/uk)
- English: [http://localhost:3000/en](http://localhost:3000/en)

## 🌐 Локалізація

Проект підтримує дві мови:
- 🇺🇦 **Українська** (за замовчуванням)
- 🇬🇧 **English**

Перемикання мов відбувається автоматично через URL:
- `/uk/` - українська версія
- `/en/` - англійська версія

## 📝 Доступні сторінки

- **Головна** (`/`) - Головна сторінка з героєм та послугами
- **Про нас** (`/about`) - Інформація про компанію
- **Послуги** (`/services`) - Список послуг автосервісу
- **Наші роботи** (`/works`) - Портфоліо робіт
- **Блог** (`/blog`) - Корисні статті
- **Контакти** (`/contact`) - Контактна інформація

## 🚀 Деплой

Найпростіший спосіб деплою - використання [Vercel Platform](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📄 Ліцензія

Цей проект розроблений для автосервісу в с. Михайлівка.
