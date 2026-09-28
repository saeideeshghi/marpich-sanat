# بررسی نسخه 0.3.3 — ۲۰۲۶-۰۹-۲۷

ورودی پروژه: `marpich-sanat-final-reviewed.zip` و مرجع پترن: `pattern-final.zip`؛ assets و فونت‌های اصلی طبق توضیح مالک پروژه در بسته موجود نیستند.

## نتایج این اصلاح

- `npm run check`: موفق؛ ساختار ۱۱ صفحه، entryها، includeها، IDها، لینک‌های داخلی و rendererها سالم هستند.
- `node --check src/js/components/site-pattern.js`: موفق؛ فایل renderer جدید خطای syntax ندارد.
- `src/data/patterns/site-pattern.json` با `pattern-final/settings.json` جایگزین شده و تنظیمات هندسه/animation مرجع بدون override ذخیره شده‌اند.
- mount پترن همچنان فقط یک‌بار انجام می‌شود: فقط فوتر در Home و هدر + فوتر در ۱۰ صفحه داخلی.
- profile پترن طبق مرجع در 463px سوییچ می‌شود؛ interpolation قبلی حذف شده است.
- opacity/light فوتر، minimum stroke، non-scaling stroke و stretch عمودی SVG که خروجی را از مرجع دور می‌کردند حذف شدند.
- reduced-motion، توقف animation هنگام خارج‌بودن از viewport و هنگام hidden شدن tab حفظ شده‌اند.

## محدودیت بررسی

۱۵۷ مسیر asset عمومی در سورس وجود دارد و assets/fonts طبق توضیح مالک پروژه عمداً در ورودی نیستند. بنابراین تطبیق نهایی تصاویر، فونت Peyda، cropها و ظاهر تمام صفحات بعد از برگرداندن فایل‌های واقعی باید روی محیط پروژه انجام شود.

در این اصلاح، build کامل Vite دوباره اجرا نشد چون نصب dependencyها در محیط بررسی کامل نشد؛ checkهای ساختاری و syntax اجرا شدند. API/CMS، ثبت واقعی فرم، جستجو/pagination و Auth واقعی نیز خارج از محدوده این اصلاح هستند.
