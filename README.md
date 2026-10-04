# مارپیچ صنعت — فرانت‌اند

نسخهٔ ۴ اکتبر ۲۰۲۶ بر اساس سورس شاخهٔ `main` با Commit `0261039b`. باکس بالایی، جدول فنی، دستاوردها و دیدگاه کارفرمای `project-details` از فایل مرجع `marpich-sanatf-07(1).zip` بازگردانده شده‌اند. سایر بخش‌ها و ۱۵۹ تنظیم ذخیره‌شدهٔ Customizer حفظ شده‌اند.

راهنمای این اصلاح: [APPLY-PROJECT-DETAILS-RESTORE.md](APPLY-PROJECT-DETAILS-RESTORE.md).

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

برای ویرایش زندهٔ همهٔ صفحه‌ها، دستور `npm run customize` را اجرا کنید؛ راهنمای کامل: [CUSTOMIZER.md](CUSTOMIZER.md).
پیش‌نمایش صفحه، انتخاب دقیق المان یا اجزای تکراری، تنظیم مستقل دسکتاپ/تبلت/موبایل و بازهٔ دلخواه، مقایسه و برگشت تغییرات دارد. پترن هدر و فوتر هم برای هندسه، مسیرها، گرادینت و انیمیشن هر حالت ویرایشگر دارند.
دکمهٔ «تأیید و ثبت» در Vite محلی، CSS، تنظیمات و دو JSON پترن را واقعاً ذخیره می‌کند؛ در نسخهٔ آنلاین، ZIP همان چهار فایل با مسیر پروژه می‌دهد. پوشهٔ `src` خروجی را Merge و Replace کنید، سپس محلی اجرا یا Build کنید.

| تنظیم | فایل |
| --- | --- |
| ویرایشگر بصری همهٔ صفحه‌ها | `tools/customizer.html` |
| تنظیمات تأییدشدهٔ ویرایشگر | `src/data/customizer/settings.json` |
| CSS نهایی تولیدشدهٔ ویرایشگر | `src/css/template-overrides.css` |
| فاصلهٔ برابر از دو لبه، اندازهٔ عکس List، فاصلهٔ بخش‌ها و Padding جدول | `src/css/layout-settings.css` |
| فونت Hero، عنوان و توضیح کارت، CTA، تگ و جدول | `src/css/type-settings.css` |
| ارتفاع مستقل هر Hero با ID همان صفحه | `src/css/hero-heights.css` |
| ظاهر خاص هر صفحه | `src/css/pages/` |
| محتوای componentها، محصولات و فیلترها | `src/data/pages/` |
| متن، تصاویر و مزایای پنج خدمت بازشونده | `expertise.html` |
| ظاهر مرجع باکس بالایی، جدول، دستاوردها و دیدگاه کارفرمای پروژه | `src/css/pages/project-details-reference.css` |
| جای‌گذاری فوتر و طرح مرجع موبایل تا عرض ۵۰۰ پیکسل | `src/data/patterns/footer-pattern.json` |
| پروفایل‌های مستقل هدر در دسکتاپ، تبلت و موبایل | `src/data/patterns/site-pattern.json` |

راهنمای دقیق تنظیمات: [docs/DESIGN-SETTINGS.md](docs/DESIGN-SETTINGS.md).
تغییرات و نتیجهٔ بررسی: [docs/RESPONSIVE-REVIEW.md](docs/RESPONSIVE-REVIEW.md).
روش جایگزینی فایل‌ها: [APPLY-RESPONSIVE-FINAL.md](APPLY-RESPONSIVE-FINAL.md).
راهنمای این تحویل: [APPLY-FINAL-POLISH.md](APPLY-FINAL-POLISH.md).

## دارایی‌ها

تصاویر اصلی موجود روی سیستم خودتان را نگه دارید؛ این بسته آن‌ها را دوباره اضافه نمی‌کند.
دارایی‌های کوچک همراه نسخهٔ اولیه، فونت‌های همراه ورودی و لوگوی جدید موج‌های آبی در بسته هستند.
مسیرهای `public/assets` و `assets` در ریشه، هر دو پشتیبانی می‌شوند؛ فایل هم‌نام در `public/assets` اولویت دارد.
فهرست مراجع در [docs/assets-manifest.json](docs/assets-manifest.json) است.

## قراردادهای اتصال

- `build/pages.js`: فهرست صفحات و منوی فعال.
- `build/html-partials.js` و `build/components.js`: ترکیب HTML و داده‌ها هنگام اجرا و Build.
- `src/js/main.js`: رفتار مشترک؛ entryهای هر صفحه در `src/js/pages` هستند.
- ترتیب CSS: عمومی، CSS صفحه، اجزای مشترک صفحه، سپس `responsive.css`؛ تنظیمات تأییدشدهٔ Customizer از یک stylesheet جدا در انتهای head بارگذاری می‌شوند.
- Breakpointها: موبایل تا 639px، تبلت از 640 تا 1179px، Desktop از 1180px.
- فرم جستجو، حالت Grid/List، منو و خدمات بازشونده فعال‌اند. نتیجهٔ جستجوی آنلاین، ثبت فرم‌ها و Auth واقعی به Backend نیاز دارند.
- فرم‌ها رویدادهای `catalog:search`، `consultation:submit` و `rfq:submit` را منتشر می‌کنند؛ adapter باید پیش از `await`، رویداد قابل لغو را `preventDefault()` کند.
- Select اصلی در فرم حفظ شده است؛ Input جستجوی گزینه‌ها جای فیلد ارسالی Backend را نمی‌گیرد.
- شناسه‌های هر خدمت، `aria-controls` و شناسهٔ پنلش باید هنگام انتقال به CMS با هم حفظ شوند.
- لینک‌های `#` باقی‌مانده و فایل‌های واقعی PDF/CAD باید پیش از تحویل محتوایی نهایی تکمیل شوند؛ جزئیات در گزارش بررسی آمده است.

برای افزودن صفحه، HTML و entry اختصاصی آن را در `build/pages.js` ثبت کنید و `npm run check` و Build را اجرا کنید.
