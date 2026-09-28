# مارپیچ صنعت — سورس فرانت‌اند

نسخه 0.3.3 · بازبینی ۲۰۲۶-۰۹-۲۷

راهنمای کامل تحویل: [docs/backend-handoff.html](docs/backend-handoff.html)
این راهنما مستقل و آفلاین است؛ جستجو و چاپ دارد و قراردادهای اتصال فرم‌ها، Auth، CMS و Razor را توضیح می‌دهد.

## راه‌اندازی

Node.js حداقل 22.12.0؛ نسخه وابستگی‌ها در package-lock.json ثبت شده‌اند.

```bash
npm ci
npm run check
npm run dev
```

HTMLهای سایت با Vite اجرا شوند؛ بازکردن مستقیم با file:// یا Live Server includeها را پردازش نمی‌کند.

```bash
npm run check:assets
npm run build
npm run preview
```

`dist` و `node_modules` در بسته نیستند؛ build آن‌ها را تولید/مصرف می‌کند. خروجی manifest در `dist/.vite/manifest.json` برای Razor است.

## دارایی‌های عمومی

assets و فونت‌ها طبق درخواست، همراه ZIP ارسالی نبوده‌اند. ۱۵۷ مسیر مرجع در `docs/assets-manifest.json` ثبت شده است. پوشه‌های اصلی را با همان نام‌ها به `public/assets` و `public/fonts` برگردانید. تا آن زمان شکست `check:assets` و خطاهای تصاویر/فونت طبیعی است؛ build موفق به معنی تأیید این فایل‌ها نیست.

## معماری

HTML + Tailwind CSS 4 + ES Modules + Vite؛ ۱۱ صفحه مستقل، بدون React/Vue.

- `build/pages.js`: رجیستری صفحه‌ها و ناوبری فعال.
- `build/html-partials.js`: ترکیب HTML، partial و JSON در dev/build.
- `build/components.js`: renderer همراه escape متن و اعتبارسنجی URL.
- `src/components`: header/footer/menu/auth و اجزای محتوایی مشترک.
- `src/data/pages`: داده includeها برای ۱۰ صفحه؛ Contact JSON ندارد. بخشی از محتوا هنوز در HTML است.
- `src/js/pages`: entry هر صفحه؛ CSS عمومی و اختصاصی و اجرای initSite.
- `src/js/main.js`: رفتار مشترک؛ فایل صفحه به آن import نمی‌شود.
- `src/css/main.css`: استایل عمومی. `catalog.css` در entryهای فهرست پس از CSS صفحه و در دو صفحه جزئیات از ابتدای CSS صفحه وارد می‌شود. `detail-technical.css` در دو entry جزئیات آخر وارد می‌شود.
- `src/data/patterns/site-pattern.json`: هندسه و تنظیمات پترن؛ مستقل از تصاویر public.

## تغییرات این نسخه

- پترن هدر و فوتر با خروجی نهایی `pattern-final` یکسان شد؛ فایل `site-pattern.json` همان تنظیمات مرجع است.
- breakpoint پترن دقیقاً 463px است: تا 463 پروفایل mobile و از 464 به بالا پروفایل desktop؛ interpolation حذف شد.
- هندسه SVG دست‌نخورده است؛ `minimumStroke` و `non-scaling-stroke` اضافه اعمال نمی‌شود.
- فوتر دیگر opacity/light جداگانه ندارد و SVG عمودی stretch نمی‌شود؛ همان سبک و animation مرجع اجرا می‌شود.
- صحنه authored پترن با ارتفاع 430px دسکتاپ و 404px موبایل حفظ می‌شود و host سایت فقط آن را clip می‌کند.
- `prefers-reduced-motion`، توقف خارج دید و جلوگیری از mount تکراری همچنان فعال است.
- راهنمای تحویل بک‌اند با رفتار جدید پترن همگام شد.

## وضعیت اتصال

| قابلیت | وضعیت |
| --- | --- |
| منو، FAQ، Auth UI، grid/list، sync فرم responsive و پترن | رفتار فرانت فعال |
| مشاوره / RFQ | event و اعتبارسنجی محلی؛ بدون ثبت واقعی |
| جستجو / advanced | event؛ بدون query آنلاین، نتیجه و pagination واقعی |
| Auth در dev | preview، OTP آزمایشی 123456 |
| Auth در production | بدون API غیرفعال |
| 3D، CAD واقعی، زبان دوم، حساب/خروج | نیازمند تکمیل |

```dotenv
VITE_AUTH_MODE=api
VITE_AUTH_API_BASE=/api/auth
```

پنج endpoint و payloadها در سند HTML آمده‌اند. متغیرهای VITE_* عمومی و build-time هستند. CSRF از meta با نام csrf-token به X-CSRF-TOKEN فرستاده می‌شود. cookie/session و مجوزها مسئولیت سرورند.

رویدادهای `consultation:submit` و `rfq:submit` دارای `{form, formData}` هستند. `catalog:search` یک object تخت از فیلدهای فرم دارد. adapter باید قبل از await، preventDefault کند و خودش وضعیت ارسال/خطا/موفقیت را مدیریت کند.

۲۹۲ لینک خالی/# در خروجی صفحات، با احتساب تکرار partialها، باقی است. مقصد واقعی باید تعیین شود. CTAهای دارای فیلد company راه تماس مستقیمی ندارند؛ پیش از فعال‌کردن ثبت، راه تماس یا حساب تأییدشده لازم است.

## قرارداد ظاهر

RTL و DOM فعلی حفظ شود. منوی دسکتاپ از 1180px؛ فوتر breakpoint مستقل دارد. جدول‌های فنی محصول/پروژه از `detail-technical.css` و کلاس‌های `details-card`, `details-table`, `extras-panel` استفاده می‌کنند. خطوط جدول CSS هستند.

CTA هیروی خانه، gradient stroke شفاف دکمه محصولات و برش تصاویر Expertise حفظ شده‌اند. `src/css/responsive.css` در importهای جاری فعال نیست؛ افزودن عمومی آن ممکن است ظاهر را عوض کند.

## بررسی و ادامه کار

- گزارش جاری: `docs/VALIDATION.md`
- شرح تغییرات و محدودیت‌ها: `docs/REVIEW.md`
- تفاوت فایل‌ها با ورودی: `docs/source-audit.json`
- گزارش‌های قدیمی: `docs/history/` (سابقه، نه نتیجه این نسخه)

برای صفحه تازه، HTML + CSS/JS صفحه را ایجاد و در `build/pages.js` ثبت کنید. سپس check/build و بررسی responsive مرتبط را انجام دهید. کلاس‌ها، data-* و ترتیب importها قرارداد مشترک با بک‌اند هستند.
