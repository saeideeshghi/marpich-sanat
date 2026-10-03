# اعمال نسخهٔ اصلاح‌شده

۱. ZIP را خارج از پوشهٔ پروژه Extract کن.
۲. محتویات آن را کنار `package.json` پروژهٔ فعلی کپی و Replace کن.
۳. پوشه‌های `src` و `public` را با پوشهٔ موجود **Merge** کن؛ پوشهٔ تصاویر، فونت‌ها یا Git را حذف نکن.
۴. پوشهٔ `node_modules`، `dist` و فایل‌های بررسی موقت در این بسته نیستند.

در Terminal همان پروژه:

```bash
npm ci
npm run check
npm run check:assets
npm run dev
```

بعد از بررسی محلی، خروجی Pages را بساز:

```bash
npm run build:pages
```

برای روش Push فعلی ریپو، `GITHUB-UPLOAD.md` را دنبال کن. بعد از Deploy موفق، صفحه را با `Ctrl + F5` تازه کن.

تنظیمات اصلی:

- فاصله‌ها و Padding جدول: `src/css/layout-settings.css`
- فونت‌ها و تگ ۱۰px: `src/css/type-settings.css`
- ارتفاع هر Hero: `src/css/hero-heights.css`
- محتوای پنل خدمات: `expertise.html`

ارتفاع Hero یک **حداقل ارتفاع** است. در نمایشگر کوچک یا با متن بلند، بخش رشد می‌کند تا متن یا فرم بریده نشود.
