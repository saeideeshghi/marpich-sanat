> بازبینی ۳ اکتبر ۲۰۲۶ — نسخه ۵: اندازه‌های هیرو در ۱۲ صفحه یکپارچه شدند؛ تنظیمات مشترک و مخصوص هر صفحه در [type-settings.css](src/css/type-settings.css) هستند. هدر از لایه هیرو خارج شد، عکس تیم و هم‌پوشانی کارت‌ها اصلاح شدند و متن‌ها و تصاویر مقالات بازبینی شدند. [گزارش فعلی](docs/2026-10-03-TYPE-HERO-V5.md) · [راهنمای تغییر اندازه‌ها](docs/TYPE-SETTINGS.md) · [راهنمای جایگزینی](APPLY-PAGES-FIXES.txt). این نسخه بر اساس آخرین گیت‌هاب آماده شده و استایل‌های دستی خارج از اصلاحات درخواستی حفظ شده‌اند.

# مارپیچ صنعت — سورس فرانت‌اند

نسخه 0.4.0 · بازبینی ۲۰۲۶-۰۹-۲۹

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

برای انتشار این ریپو در GitHub Pages، از `npm run build:pages` و `npm run preview:pages` استفاده کنید؛ راهنمای کامل در `GITHUB-UPLOAD.md` است. دارایی‌های `assets` در ریشه نیز هنگام build خوانده می‌شوند. `public/assets` در صورت هم‌نام‌بودن فایل اولویت دارد؛ خروجی موقت در `.cache` است.

`dist` و `node_modules` در بسته نیستند؛ build آن‌ها را تولید/مصرف می‌کند. خروجی manifest در `dist/.vite/manifest.json` برای Razor است.

## دارایی‌های عمومی

۹ فایل فونت اصلی Peyda و دو SVG فلش فرایند همکاری داخل این بسته هستند. تصاویر و لوگوهای سنگین مطابق درخواست مالک در ZIP نیستند؛ فایل‌های موجود در Clone ریپو حفظ شوند و دارایی‌های جدید محلی اضافه شوند. ۱۷۴ مسیر مرجع در `docs/assets-manifest.json` ثبت شده است. `public/assets` و `assets` ریشه هر دو پشتیبانی می‌شوند. `npm run check:assets` را پس از ادغام فایل‌ها اجرا کنید؛ build موفق به معنی موجود بودن همه تصاویر نیست.

## معماری

HTML + Tailwind CSS 4 + ES Modules + Vite؛ ۱۲ صفحه مستقل، بدون React/Vue.

- `build/pages.js`: رجیستری صفحه‌ها و ناوبری فعال.
- `build/html-partials.js`: ترکیب HTML، partial و JSON در dev/build.
- `build/components.js`: renderer همراه escape متن و اعتبارسنجی URL.
- `src/components`: header/footer/menu/auth و اجزای محتوایی مشترک.
- `src/data/pages`: داده includeها برای صفحات دارای component data؛ Contact JSON ندارد. بخشی از محتوا هنوز در HTML است.
- `src/js/pages`: entry هر صفحه؛ CSS عمومی و اختصاصی و اجرای initSite.
- `src/js/main.js`: رفتار مشترک؛ فایل صفحه به آن import نمی‌شود.
- `src/css/main.css`: استایل عمومی. `catalog.css` در entryهای فهرست پس از CSS صفحه و در دو صفحه جزئیات از ابتدای CSS صفحه وارد می‌شود. `detail-technical.css` در دو entry جزئیات آخر وارد می‌شود.
- `src/data/patterns/site-pattern.json`: هندسه و تنظیمات پترن؛ مستقل از تصاویر public.

## تغییرات این نسخه

- صفحه جدید `articles.html` بر اساس رفرنس Desktop/Mobile اضافه شد: Hero، جستجو و دسته‌بندی، Grid/List مقالات، ۱۰ کارت، Load more و CTA مشاوره.
- مسیر «مقالات» در Header، Mobile Menu و Footer به صفحه جدید متصل شد و `articles` به registry ساخت اضافه شد.
- منوی موبایل از حالت تمام‌صفحه تیره به Drawer روشن با `#ECEFF8` و `border-radius: 0 16px 16px 0` تغییر کرد؛ submenuها accordion و قابل استفاده با keyboard هستند.
- Dropdown دسکتاپ منو با `#ECEFF8` و `border-radius: 16px 4px 16px 16px` اضافه شد.
- Selectهای فرم‌های کاتالوگ به Custom Dropdown قابل استایل ارتقا یافتند؛ `<select>` اصلی برای FormData و اتصال Backend حفظ شده است.
- برای نمایشگرهای >=1600px، containerهای اصلی تا 1680px رشد می‌کنند تا حاشیه‌های افراطی روی 1920/2K ایجاد نشود؛ هندسه 1440px تغییر نکرده است.
- فایل‌های تصویر صفحه مقالات زیر `/assets/images/articles/` انتظار می‌روند؛ در نبود آن‌ها fallback بصری نمایش داده می‌شود.

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

۱۱۸ لینک خالی/# در خروجی صفحات، با احتساب تکرار partialها، باقی است. مقصد واقعی باید تعیین شود. CTAهای دارای فیلد company راه تماس مستقیمی ندارند؛ پیش از فعال‌کردن ثبت، راه تماس یا حساب تأییدشده لازم است.

## قرارداد ظاهر

RTL و DOM فعلی حفظ شود. منوی دسکتاپ از 1180px؛ پترن فوتر از همین عرض با هدر یکسان است و زیر آن از طرح مستقل موبایل/تبلت استفاده می‌کند. جدول‌های فنی محصول/پروژه از `detail-technical.css` و کلاس‌های `details-card`, `details-table`, `extras-panel` استفاده می‌کنند. خطوط جدول CSS هستند.

CTA هیروی خانه یک Grid دو ستونه RTL است؛ زیر 360px تک‌ستونه می‌شود تا متن 14px خوانا بماند. دکمه محصولات پس‌زمینه شفاف و gradient stroke دارد. `src/css/responsive.css` پس از CSS صفحه و جدول‌های فنی در هر ۱۲ entry وارد می‌شود؛ فونت و هندسه responsive را در همین لایه تنظیم کنید. ظاهر Footer در `src/css/components/footer.css` و HTML مشترک آن در `src/components/footer.html` است.

## بررسی و ادامه کار

- گزارش Hero و Responsive قبلی: `docs/2026-10-02-FINAL-RESPONSIVE.md`
- بازبینی جاری پترن و کارت‌ها: `docs/2026-10-02-PATTERNS-CARDS.md`
- آپدیت ثابت Windows: `PUSH-GITHUB.cmd`؛ راهنما: `GITHUB-UPLOAD.md`
- گزارش قبلی: `docs/2026-10-01-FOOTER-STUDIO.md`
- ادیتور پترن: `tools/footer-pattern-studio.html` (مستقیم و آفلاین باز می‌شود)؛ راهنمای اعمال خروجی در `tools/README.md`
- اصلاحات پترن/هیرو/لینک‌ها: `docs/2026-10-01-PATTERN-HERO-LINKS.md`
- اصلاحات پایه موبایل: `docs/2026-10-01-MOBILE-FIXES.md`
- اعتبارسنجی پایه پروژه: `docs/VALIDATION.md`
- شرح تغییرات و محدودیت‌ها: `docs/REVIEW.md`
- تفاوت فایل‌ها با ورودی: `docs/source-audit.json`
- گزارش‌های قدیمی: `docs/history/` (سابقه، نه نتیجه این نسخه)

برای صفحه تازه، HTML + CSS/JS صفحه را ایجاد و در `build/pages.js` ثبت کنید. سپس check/build و بررسی responsive مرتبط را انجام دهید. کلاس‌ها، data-* و ترتیب importها قرارداد مشترک با بک‌اند هستند.

### Articles polish — 2026-09-29 (pass 2)

- The article read-more link is aligned to the visual left in two-column grid cards and pinned to the bottom-left in desktop list view.
- Article media now overscans the media frame by 1px while keeping `object-fit: cover`, preventing the card/media background from showing at fractional zoom or SVG edges.
- The articles hero eyebrow now uses the same orange accent-line language as the other internal page heroes.
- The article search panel sits slightly higher, while the spacing below it before the catalog heading has been increased on desktop, tablet and mobile.
- Shared header/menu code remains untouched by this pass so the same responsive behavior continues across every page; project-wide structural checks and production build should be run after changes.


### Navigation / article media polish
- Active navigation color is `#79B6ED` across desktop/mobile shared navigation.
- Article media uses explicit full-size cover behavior with a small overscan to avoid SVG/image edge gaps.
