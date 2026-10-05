# مارپیچ صنعت

نسخهٔ V3 (`3.0.0`) — ۴ اکتبر ۲۰۲۶. انتشار با tag به نام `v3` روی branch `main` انجام می‌شود؛ راهنما در `GITHUB-UPLOAD.md` است. مبنا: `backup.rar` ارسالی؛ ظاهر، محتوای ۱۲ صفحه و ۱۵۹ قانون ثبت‌شدهٔ قبلی حفظ شده‌اند. فایل ورودی Customizer و workflow لازم از همان ریپوی GitHub بازیابی شدند.

HTML، Tailwind CSS 4، ES Modules و Vite؛ کامپوننت‌های HTML در زمان Build ترکیب می‌شوند. فریم‌ورک UI اضافه نشده است.

## جایگزینی این بسته

1. محتوای ZIP را در پوشهٔ اصلی پروژه کنار `package.json`، Merge و Replace کن.
2. پوشه‌های `assets`، `public` و فونت‌های قبلی را نگه دار. این بسته جایگزین تصاویر اصلی نیست.
3. فایل‌های قدیمی مشخص‌شده را حذف کن:

```bash
npm run clean:legacy -- --apply
npm ci
npm run check
npm run customize
```

`clean:legacy` فقط فهرست صریح `docs/obsolete-files.json` را حذف می‌کند؛ بدون `--apply` فقط فهرست را نمایش می‌دهد. نیازی به پاک‌کردن دستی پوشه‌ها نیست.

Node.js حداقل 22.12.0 لازم است. در ویندوز `CUSTOMIZE.cmd` نیز همان ویرایشگر را اجرا و وابستگی‌های قدیمی را اصلاح می‌کند. برای اجرای عادی: `npm run dev`. بازکردن HTML با دوبار کلیک یا Live Server، includeها را پردازش نمی‌کند.

## Customizer

مسیر محلی: `/tools/customizer.html`. بخش مشترک یا المان دقیق را انتخاب کن، محدودهٔ صفحه و اندازه را مشخص کن و مقادیر را تغییر بده. بازه‌های دلخواه، واحدهای CSS، Grid/Flex، موقعیت، رنگ، سایه، hover/focus، پترن‌ها، Undo/Redo، کپی تنظیمات و مدیریت قانون‌ها قابل ویرایش‌اند.

ثبت محلی، فایل‌های واقعی را می‌نویسد. نسخهٔ GitHub Pages امکان نوشتن سورس ندارد و ZIP قابل جایگزینی می‌دهد. برای انتشارِ تغییرات ثبت‌شده باید Build و Push انجام شود.

راهنمای عملی: [CUSTOMIZER.md](CUSTOMIZER.md). قرارداد کلاس‌ها و ترتیب CSS: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). راهنمای Backend: [docs/backend-handoff.html](docs/backend-handoff.html).

## ساخت و کنترل

```bash
npm run format:check
npm run check
npm run check:assets
npm run build
npm run build:pages
npm run preview:pages
```

`check:assets` را در نسخهٔ دارای تصاویر کامل اجرا کن. خروجی Build در `dist` قرار می‌گیرد؛ آن را داخل سورس نگه ندار.

- موبایل: تا 639px؛ تبلت: 640–1179px؛ دسکتاپ: از 1180px.
- فرمت کد با `npm run format` یکسان می‌شود. JSON پترن‌ها و CSS تولیدی از فرمت دستی مستثنی‌اند.
- `assets` ریشه و `public/assets` پشتیبانی می‌شوند؛ فایل هم‌نام در `public/assets` اولویت دارد.
- Auth واقعی و ثبت فرم‌ها هنوز به Backend نیاز دارند. adapterهای رویداد و قرارداد API حفظ شده‌اند.
- ۱۱۴ لینک placeholder موجود در قالب‌های رندرشده، همان محتوای قبلی‌اند و مقصد واقعی‌شان باید هنگام اتصال CMS تکمیل شود.

گزارش همین نسخه: [docs/VALIDATION.md](docs/VALIDATION.md). انتشار: [GITHUB-UPLOAD.md](GITHUB-UPLOAD.md).
