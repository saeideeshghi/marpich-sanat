# مارپیچ صنعت — فرانت‌اند

نسخهٔ اصلاح‌شدهٔ ۳ اکتبر ۲۰۲۶ بر اساس فایل `marpich-sanatf-10.zip`.

۱۲ صفحه با HTML، Tailwind CSS 4، ES Modules و Vite؛ بدون React یا Vue.
Header، Footer، منوی موبایل و فرم‌های تکراری از `src/components` ساخته می‌شوند.

## اجرا و ساخت

Node.js حداقل 22.12.0، مطابق `package.json`:

```bash
npm ci
npm run check
npm run dev
```

صفحات را با Vite باز کنید؛ بازکردن مستقیم HTML با `file://`، includeها را پردازش نمی‌کند.

```bash
npm run check:assets
npm run build
npm run preview
```

برای همین GitHub Pages:

```bash
npm run build:pages
npm run preview:pages
```

راهنمای به‌روزرسانی ریپو: [GITHUB-UPLOAD.md](GITHUB-UPLOAD.md).

## تنظیم ظاهر

| تنظیم | فایل |
| --- | --- |
| فاصلهٔ برابر از دو لبه، اندازهٔ عکس List، فاصلهٔ بخش‌ها و Padding جدول | `src/css/layout-settings.css` |
| فونت Hero، عنوان و توضیح کارت، CTA، تگ و جدول | `src/css/type-settings.css` |
| ارتفاع مستقل هر Hero با ID همان صفحه | `src/css/hero-heights.css` |
| ظاهر خاص هر صفحه | `src/css/pages/` |
| محتوای componentها، محصولات و فیلترها | `src/data/pages/` |
| متن، تصاویر و مزایای پنج خدمت بازشونده | `expertise.html` |

راهنمای دقیق تنظیمات: [docs/DESIGN-SETTINGS.md](docs/DESIGN-SETTINGS.md).
تغییرات و نتیجهٔ بررسی: [docs/RESPONSIVE-REVIEW.md](docs/RESPONSIVE-REVIEW.md).
روش جایگزینی فایل‌ها: [APPLY-RESPONSIVE-FINAL.md](APPLY-RESPONSIVE-FINAL.md).

## دارایی‌ها

تصاویر اصلی موجود روی سیستم خودتان را نگه دارید؛ این بسته آن‌ها را دوباره اضافه نمی‌کند.
دارایی‌های کوچک همراه نسخهٔ اولیه، فونت‌های همراه ورودی و لوگوی جدید موج‌های آبی در بسته هستند.
مسیرهای `public/assets` و `assets` در ریشه، هر دو پشتیبانی می‌شوند؛ فایل هم‌نام در `public/assets` اولویت دارد.
فهرست مراجع در [docs/assets-manifest.json](docs/assets-manifest.json) است.

## قراردادهای اتصال

- `build/pages.js`: فهرست صفحات و منوی فعال.
- `build/html-partials.js` و `build/components.js`: ترکیب HTML و داده‌ها هنگام اجرا و Build.
- `src/js/main.js`: رفتار مشترک؛ entryهای هر صفحه در `src/js/pages` هستند.
- ترتیب CSS: عمومی، CSS صفحه، اجزای مشترک صفحه، سپس `responsive.css`؛ لایهٔ نهایی فاصله‌ها در `site-layout.css` است.
- Breakpointها: موبایل تا 639px، تبلت از 640 تا 1179px، Desktop از 1180px.
- فرم جستجو، حالت Grid/List، منو و خدمات بازشونده فعال‌اند. نتیجهٔ جستجوی آنلاین، ثبت فرم‌ها و Auth واقعی به Backend نیاز دارند.
- فرم‌ها رویدادهای `catalog:search`، `consultation:submit` و `rfq:submit` را منتشر می‌کنند؛ adapter باید پیش از `await`، رویداد قابل لغو را `preventDefault()` کند.
- Select اصلی در فرم حفظ شده است؛ Input جستجوی گزینه‌ها جای فیلد ارسالی Backend را نمی‌گیرد.
- شناسه‌های هر خدمت، `aria-controls` و شناسهٔ پنلش باید هنگام انتقال به CMS با هم حفظ شوند.
- لینک‌های `#` باقی‌مانده و فایل‌های واقعی PDF/CAD باید پیش از تحویل محتوایی نهایی تکمیل شوند؛ جزئیات در گزارش بررسی آمده است.

برای افزودن صفحه، HTML و entry اختصاصی آن را در `build/pages.js` ثبت کنید و `npm run check` و Build را اجرا کنید.
