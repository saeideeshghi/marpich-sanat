# مارپیچ صنعت — مرجع پروژه و ادامهٔ توسعه

> آخرین به‌روزرسانی: ۲۰۲۶-۰۹-۲۶؛ نسخهٔ این مرحله: 0.3.1 — الگوی متحرک مشترک Header/Footer و یکپارچه‌سازی Heroهای داخلی.
> این فایل مرجع ادامهٔ کار است؛ سورس تازه‌ای که کاربر بعداً ویرایش می‌کند، همیشه بر این توضیحات اولویت دارد.

## شروع سریع و جایگزینی نسخه

1. ZIP را در یک پوشهٔ تازه استخراج کن تا فایل‌های قدیمی و بلااستفاده دوباره با نسخهٔ جدید مخلوط نشوند.
2. پوشه‌های واقعی `public/assets` و `public/fonts` پروژهٔ خودت را در همین مسیرها کپی کن. این ZIP عمداً تصاویر و فونت‌ها را ندارد.
3. Node.js حداقل `22.12.0` لازم است؛ dependencyها با lockfile نصب شوند.

```bash
npm ci
npm run check
npm run dev
```

آدرس اعلام‌شده توسط Vite را باز کن؛ معمولاً `http://localhost:5173`.
HTMLها را با `file://` یا Live Server مستقل باز نکن؛ partialهای مشترک در Vite پردازش می‌شوند.

| فرمان                                     | کاربرد                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `npm run dev`                             | توسعه و پیش‌نمایش تعامل‌های Auth                                        |
| `npm run check`                           | ثبت صفحات، importها، entry، partialها، ID و لینک داخلی                  |
| `npm run check:assets`                    | کنترل assetها و فونت‌های referenced؛ بعد از کپی فایل‌های واقعی اجرا شود |
| `node scripts/check-assets.js --manifest` | به‌روزرسانی `docs/assets-manifest.json` و کنترل وجود فایل‌ها            |
| `npm run build`                           | ساخت تمام ۱۱ صفحه در `dist`                                             |
| `npm run preview`                         | نمایش خروجی production؛ حالت تست Auth در آن فعال نیست                   |

## ویرایش کامپوننت‌ها و استایل‌ها

- محتوای تکراری در `src/data/pages/<page>.json` است؛ عنوان، متن، گزینه‌های فیلتر، کارت محصولات، نظرات و پرسش‌های متداول هر صفحه را همان‌جا تغییر بده.
- ساختار HTML در `src/components/` است: فرم مشاوره، جستجو، کارت محصول، نظرات و پرسش‌های متداول. Products و Air Handling اکنون هر دو از یک `product-card.html` استفاده می‌کنند و CTA کاتالوگ Products/Air Handling/Industries از `catalog-consultation.html` می‌آید.
- استایل اختصاصی صفحه‌ها در `src/css/pages/<page>.css` است. Search/Filter، Product Card/Grid و Catalog Consultation مشترک در `src/css/components/catalog.css` نگهداری می‌شوند و در Products/Air Handling/Industries بعد از CSS صفحه import می‌شوند تا یک source of truth داشته باشند.
- مسیر اتصال HTML صفحه به قالب و داده، `<!-- @include ... -->` است که `build/html-partials.js` هنگام dev/build پردازش می‌کند. به همین خاطر فایل‌های HTML را از طریق Vite اجرا کن.
- فرم مشاوره Home/About/Expertise همان component قدیمی `consultation.html` و sync دو فرم را حفظ می‌کند. CTA کاتالوگ Products/Air Handling/Industries component جداگانهٔ `catalog-consultation.html` دارد؛ ثبت واقعی هیچ‌کدام هنوز به Backend وصل نیست.
- فیلترها و جستجو پیام وضعیت نمایش‌خوانی دارند و رویدادهای `catalog:search` و `catalog:advanced` را برای اتصال آینده منتشر می‌کنند؛ دادهٔ نتایج واقعی هنوز ارائه نشده است.

## معماری ثابت پروژه

HTML + Tailwind CSS 4 + JavaScript ES Modules + Vite؛ بدون React/Vue.
نسخه‌های dependency در این مرحله تغییر نکرده‌اند: Vite `^8.3.0`، Tailwind و پلاگین آن `^4.3.3`، Font Awesome `^7.3.1`؛ نسخهٔ دقیق در `package-lock.json` است.

| محل                                  | مسئولیت                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| `*.html` در ریشه                     | محتوای مستقل هر صفحه؛ فقط یک module entry                           |
| `src/components/header.html`         | هدر و دکمهٔ ورود دسکتاپ                                             |
| `src/components/mobile-menu.html`    | منوی موبایل و دکمهٔ ورود آن                                         |
| `src/components/footer.html`         | فوتر مشترک                                                          |
| `src/components/auth-modal.html`     | تمام حالت‌های ورود، ثبت‌نام و بازیابی رمز                           |
| `src/css/main.css`                   | Tailwind، Font Awesome و CSS مشترک                                  |
| `src/css/tokens.css`                 | رنگ‌ها، فونت، container و breakpointهای مشترک                       |
| `src/css/fonts.css`                  | وزن‌های Peyda و مسیر فایل‌های فونت                                  |
| `src/css/base.css`                   | قواعد پایهٔ سایت و RTL                                              |
| `src/css/components/site.css`        | Header/Menu/Focus و پیام فرم‌های نمایشی                             |
| `src/css/components/pattern.css`     | لایه و geometry الگوی متحرک مشترک Header/Footer                        |
| `src/css/components/catalog.css`     | Search/Filter، Product Card/Grid و CTA مشترک صفحات کاتالوگی          |
| `src/css/components/auth.css`        | طراحی و responsive پنجرهٔ ورود                                      |
| `src/css/pages/<page>.css`           | فقط CSS اختصاصی همان صفحه                                           |
| `src/js/main.js`                     | `initSite()` و راه‌اندازی رفتارهای مشترک                            |
| `src/js/components/menu.js`          | منوی موبایل، focus، inert و scroll lock                             |
| `src/js/components/site-pattern.js`  | mount الگوی متحرک؛ Header صفحات داخلی + Footer همه صفحات             |
| `src/js/components/auth.js`          | state فرم‌ها، validation، OTP، تایمر، focus و تعاملات               |
| `src/js/components/pending-forms.js` | جلوگیری از ارسال واقعی فرم‌های مشاورهٔ نمایشی                       |
| `src/js/services/auth-api.js`        | تنها محل اتصال Auth به Backend و حالت پیش‌نمایش                     |
| `src/js/pages/<page>.js`             | import CSSها، اجرای `initSite()` و رفتار اختصاصی صفحه               |
| `build/pages.js`                     | تنها فهرست ثبت صفحات و active navigation                            |
| `build/html-partials.js`             | درج partialها در زمان build/dev؛ بدون fetch یا تزریق HTML در مرورگر |
| `vite.config.js`                     | Vite multi-page و Tailwind                                          |
| `scripts/`                           | بررسی ساختار و assetها                                              |
| `docs/assets-manifest.json`          | فهرست مسیرهای asset استخراج‌شده از HTML/CSS/JS                      |
| `public/assets/` و `public/fonts/`   | فایل‌های واقعی کاربر؛ عمداً خارج از ZIP                             |
| `.env.example`                       | الگوی تنظیم اتصال Auth؛ فاقد secret                                 |

پوشهٔ `build` تنظیمات ساخت است؛ `dist` خروجی تولیدشده است و دستی ویرایش نمی‌شود.

## وضعیت هر ۱۱ صفحه

در جدول، entry و CSS هر صفحه نام یکسانی دارند و در `src/js/pages` و `src/css/pages` قرار دارند.
«پیاده‌سازی‌شده» به معنی تکمیل Backend یا همهٔ مقصدهای محتوا نیست.

| صفحه           | HTML                    | entry/CSS          | activeNav    | وضعیت و قرارداد مهم                                                               |
| -------------- | ----------------------- | ------------------ | ------------ | --------------------------------------------------------------------------------- |
| اصلی           | `index.html`            | `home`             | `home`       | Hero، تخصص، پروژه، محصول، مقاله و مشاوره؛ دو فرم مشاوره اکنون handler مشترک دارند |
| محصولات        | `products.html`         | `products`         | `products`   | Search/Filter + Product Card/Grid + Catalog CTA مشترک؛ Featured Categories محلی   |
| جزئیات محصول   | `product-details.html`  | `product-details`  | `products`   | چرخش/reset تصویر و fullscreen؛ مدل 3D واقعی نیست                                  |
| تماس           | `contact.html`          | `contact`          | `contact`    | فرم و بررسی فایل PDF/DWG/DOC/DOCX تا ۲۰MB؛ ارسال واقعی ندارد                      |
| جزئیات پروژه   | `project-details.html`  | `project-details`  | `projects`   | چرم مشهد؛ Summary، Technical، KPI و CTA؛ ساختار تأییدشده                          |
| درباره ما      | `about.html`            | `about`            | `about`      | تیم، Timeline، تخصص، مدیریت، Gallery، گواهینامه و CTA؛ تأییدشده                   |
| پروژه‌ها       | `projects.html`         | `projects`         | `projects`   | ۱۲ کارت دسکتاپ، ۱۰ کارت موبایل، Grid/List و Testimonials؛ تأییدشده                |
| صنعت نساجی     | `industry-textile.html` | `industry-textile` | `industries` | Summary، ۴ محصول، ۴ پروژه، ۳ نظر و ۳ FAQ؛ تقریباً نهایی                           |
| حوزه‌های تخصص  | `expertise.html`        | `expertise`        | `expertise`  | ۵ خدمت + CTA؛ Crop/Cover بعضی PNGها در عرض کوچک هنوز باز است                      |
| هواسازها       | `air-handling.html`     | `air-handling`     | `products`   | Search، ۱۲ محصول و CTA با component/style مشترک Products؛ Intro محلی              |
| صنایع تحت پوشش | `industries.html`       | `industries`       | `industries` | Search و Catalog CTA مشترک؛ Featured/Industry Cards و Grid/List اختصاصی صفحه       |

### جزئیاتی که باید حفظ شوند

- Header/Menu: دسکتاپ از `1180px`؛ پایین‌تر همبرگر. لوگوی موبایل: نماد چپ و متن راست، فاصلهٔ بالا `50px`.
- Footer breakpoint اصلی `1024px` است. هدر، فوتر و منو دوباره داخل صفحه‌ها کپی نشوند.
- رنگ آبی `#79B6ED`، نارنجی `#F76E11` و سرمه‌ای `#0F172B`؛ فونت Peyda.
- CSS جدید Tailwind-first باشد؛ جزئیات اختصاصی هر صفحه فقط در فایل همان صفحه و با namespace خودش.
- صفحات تأییدشده بازنویسی نشوند؛ اصلاح بعدی فقط اختلاف مشخص با screenshot واقعی باشد.
- Pattern نهایی کاربر از `pattern-final.zip` به‌صورت component مشترک ادغام شده است: Header همهٔ صفحات داخلی Pattern دارد، ولی Header صفحهٔ `index.html` عمداً Pattern ندارد؛ Footer در تمام ۱۱ صفحه Pattern دارد. تنظیمات منبع در `src/data/patterns/site-pattern.json` است.
- در Projects حالت List فقط گوشه‌های سمت چپ **تصویر** بدون radius است، نه کل باکس؛ دسکتاپ `0 .85rem .85rem 0` و موبایل `0 .55rem .55rem 0`.
- Testimonials پروژه‌ها زیر `1024px` و نساجی زیر `1180px` slider هستند؛ autoplay حدود ۵.۵ ثانیه، توقف هنگام تعامل و رعایت reduced motion حفظ شود.
- Summary نساجی gradient با `180deg` دارد. FAQ تک‌باز است و separator برابر `linear-gradient(270deg, #79b6ed 31%, #e4edff 100%)` می‌ماند.
- صنایع: چیدمان فیزیکی Featured Mosaic برابر LTR، محتوای کارت‌ها RTL؛ overlay برابر `rgba(15,23,43,.57)`.
- «بررسی راهکارهای این صنعت» در صنایع راست‌چین و underline؛ «بارگذاری صنایع بیشتر» underline دارد.
- Search پنل Products/Air Handling/Industries از `catalog.css` مشترک است: radius دسکتاپ 16px و موبایل 8px، stroke فیلدهای فیلتر `#808080`، chip فعال `#E0DFF5` با stroke `#C5C4D5`، آیکن جستجو چپ و input راست‌چین. Clear Filters بلافاصله بعد از chipها و در سمت چپ آن‌ها می‌آید، نه در لبهٔ دور.
- Air Handling و Industries: Grid چهار/سه/دو ستون در دسکتاپ/تبلت/موبایل؛ List تک‌ستونه و تصویر سمت راست. تگ محصولات هواسازها `bottom:16px` و در عرض کوچک `8px`.
- `about`: مسیر تجربه `/assets/images/about/experience.svg`؛ Gallery gradient سفید دارد.
- `project-details`: Technical در موبایل diagram بالا و table پایین؛ KPI و badgeها حفظ شوند.
- `expertise`: تصاویر و آیکن‌ها PNG هستند؛ gradient فعلی Rectangle 99 و flip تصویر اول حفظ شود. پیشنهاد قبلیِ zoom/translate عمومی تأیید نشده؛ مبنای ادامه نیست. مشکل Crop فعلاً طبق تصمیم کاربر باز می‌ماند.
- placeholderها و فرم‌های بدون Backend نباید نتیجهٔ واقعی ساختگی نشان دهند.

## ورود، ثبت‌نام و بازیابی رمز — این مرحله

یک `<dialog>` مشترک در سطح مستقیم `body` اضافه شده و دکمه‌های دسکتاپ و منوی موبایل همهٔ صفحات آن را باز می‌کنند.
طراحی از ۸ تصویر مرجع کاربر گرفته شده است؛ SVGهای کوچک آیکن‌ها inline هستند و فایل asset تازه‌ای لازم ندارند.

| حالت           | تعامل                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------- |
| ورود           | موبایل/ایمیل + رمز، نمایش/پنهان کردن رمز، remember، ورود با OTP، لینک ثبت‌نام و فراموشی  |
| ثبت‌نام        | نام، موبایل/ایمیل، رمز و تکرار؛ سپس تأیید حساب با کد                                     |
| فراموشی رمز    | گرفتن موبایل/ایمیل؛ سپس OTP و انتخاب رمز جدید                                            |
| دریافت کد ورود | اگر در فرم ورود شناسه وارد نشده، این فرم شماره/ایمیل را دریافت می‌کند                    |
| کد شش‌رقمی     | ورود خودکار بین خانه‌ها، paste و SMS autofill، رقم فارسی/عربی، ویرایش شناسه و ارسال مجدد |
| رمز جدید       | رمز حداقل ۸ کاراکتر + تکرار، سپس بازگشت به ورود                                          |

چهار حالت اصلی مطابق reference هستند؛ فرم دریافت شناسه و انتخاب رمز جدید برای کامل شدن مسیر کلیک‌ها با همان سبک اضافه شده‌اند.

### طراحی و رفتار Modal

- رنگ بدنهٔ modal از تصویر مرجع `#D9D9D9`؛ آبی/نارنجی از tokenهای اصلی.
- backdrop: `rgba(15, 23, 43, 0.8)` و `backdrop-filter: blur(6.8px)`؛ استفاده از `filter` خودِ باکس را تار می‌کند و معادل تار شدن صفحهٔ پشت نیست.
- modal حداکثر عرض 500px، مرکز viewport، max-height متناسب با `100dvh` و اسکرول داخلی در صفحهٔ کوتاه.
- بستن با ×، کلیک پشت پنجره و Escape؛ focus در پنجره نگه داشته می‌شود و هنگام بستن به دکمهٔ قبلی برمی‌گردد.
- ورود از منوی موبایل ابتدا منو را می‌بندد؛ هنگام بستن modal، focus به همبرگر برمی‌گردد.
- پس‌زمینه توسط native modal غیرفعال می‌شود؛ قفل اسکرول با منوی موبایل تداخل ندارد.
- تایمر ارسال مجدد از زمان واقعی محاسبه می‌شود؛ پیش‌فرض ۶۰ ثانیه و مقدار سرور قابل استفاده است.
- شماره با `09`، `+98` یا `0098` پذیرفته و به `09...` تبدیل می‌شود. شناسه‌ها و نام کاربر با text node نمایش داده می‌شوند.
- درخواست تکراری هنگام pending مسدود است؛ بستن پنجره درخواست را abort می‌کند و پاسخ دیررس UI را تغییر نمی‌دهد. timeout برابر ۲۰ ثانیه است.
- رمز و OTP در localStorage/sessionStorage ذخیره نمی‌شوند؛ بستن فرم یا تغییر مرحله رمزها را پاک می‌کند.

### پیش‌نمایش بدون Backend

در `npm run dev` و تا وقتی `VITE_AUTH_MODE=api` تنظیم نشده، preview فعال است:

- شناسهٔ معتبر و برای ثبت‌نام رمز حداقل ۸ کاراکتری وارد کن.
- کد آزمایشی `123456` است؛ در فرم OTP صریحاً توضیح داده می‌شود که پیامک/ایمیل ارسال نشده.
- پایان فرایند فقط پیام تکمیل پیش‌نمایش می‌دهد؛ حساب، session یا رمز واقعی ایجاد/تغییر نمی‌کند.
- `npm run build` این حالت را غیرفعال می‌کند. برای نسخهٔ واقعی API لازم است؛ production بدون پیکربندی پیام غیرفعال بودن سرویس می‌دهد.
- remember در preview فقط انتخاب فرم است؛ ماندگاری session واقعی مسئولیت Backend است.

### قرارداد اتصال به ASP.NET Core

فایل `.env.example` را به `.env.local` کپی کن و دو مقدار را فعال کن؛ سپس dev server را restart یا production را rebuild کن:

```dotenv
VITE_AUTH_MODE=api
VITE_AUTH_API_BASE=/api/auth
```

این مسیر یک قرارداد پیشنهادی برای اتصال است؛ وجود این endpointها روی Backend فعلی تأیید نشده.
UI فقط از `src/js/services/auth-api.js` استفاده می‌کند؛ تطبیق URL، payload و antiforgery با قرارداد تیم Backend در همین فایل انجام شود.

| POST endpoint              | JSON ورودی                                           | پاسخ موفق مورد انتظار                                                                       |
| -------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `/api/auth/login`          | `identifier, password, remember`                     | `{ ok: true, user }` + session cookie سمت سرور                                              |
| `/api/auth/register`       | `fullName, identifier, password`                     | `{ ok: true, challengeId, retryAfter: 60 }`؛ حساب pending و ارسال کد                        |
| `/api/auth/request-code`   | `identifier, purpose` و در resend `challengeId` قبلی | `{ ok: true, challengeId, retryAfter: 60 }`                                                 |
| `/api/auth/verify-code`    | `identifier, challengeId, purpose, code, remember`   | برای login/register: `{ ok: true, user }` و session؛ برای reset: `{ ok: true, resetToken }` |
| `/api/auth/reset-password` | `resetToken, password`                               | `{ ok: true }`                                                                              |

- `purpose` یکی از `login`، `register` و `reset` است. سرور challenge را به شناسه، هدف، انقضا و محدودیت تعداد تلاش مرتبط کند.
- خطای معمول: HTTP 4xx و `{ ok: false, message: "پیام قابل نمایش" }`. پاسخ نامعتبر، شبکه، timeout و 5xx در UI مدیریت می‌شود.
- محدودیت ارسال/تلاش: HTTP `429` با `Retry-After` به‌صورت تعداد ثانیه. تایمر فرانت کنترل امنیتی محسوب نمی‌شود؛ محدودیت واقعی سمت سرور لازم است.
- در register اولیه سرور دادهٔ ثبت‌نام را نگه می‌دارد؛ resend فقط همان challenge را تمدید می‌کند و به ارسال دوبارهٔ رمز نیاز ندارد.
- resetToken باید کوتاه‌عمر و یک‌بارمصرف باشد؛ فقط در حافظهٔ همین فرم نگه داشته می‌شود.
- درخواست‌ها `credentials: same-origin` دارند؛ مسیر API ترجیحاً هم‌origin باشد. session امن با HttpOnly/Secure/SameSite در Backend تنظیم شود.
- اگر backend meta با نام `csrf-token` ارائه کند، مقدار در هدر `X-CSRF-TOKEN` ارسال می‌شود؛ نام و شیوهٔ token باید با تنظیمات ASP.NET Core هماهنگ شود.
- متغیر `VITE_` عمومی و داخل bundle است؛ secret/API key در آن قرار نده.
- بعد از ورود یا تأیید حساب واقعی، رویداد `auth:success` روی document با `{ user, purpose }` منتشر می‌شود. پنل حساب کاربری هنوز طراحی/پیاده‌سازی نشده و redirect ساختگی اضافه نشده است.

## Navigation جاری

لینک‌های مشترک هدر، موبایل و فوتر به صفحه‌های مستقل موجود وصل شده‌اند.

| data-nav     | مقصد                  |
| ------------ | --------------------- |
| `home`       | `index.html`          |
| `projects`   | `projects.html`       |
| `expertise`  | `expertise.html`      |
| `products`   | `products.html`       |
| `industries` | `industries.html`     |
| `articles`   | `index.html#articles` |
| `about`      | `about.html`          |
| `contact`    | `contact.html`        |

صفحهٔ نساجی و صنایع اکنون `activeNav: industries` دارند؛ تنظیم قبلی expertise منسوخ است.
`aria-current="page"` فقط برای لینک همان صفحه است؛ دستهٔ والد در صفحهٔ جزئیات `aria-current="true"` می‌گیرد.
جستجوی هدر/منو به `products.html#product-search` می‌رود.

## مرتب‌سازی انجام‌شده

- حذف فایل‌های بدون استفادهٔ `src/js/menu.js`، `src/js/contact.js`، `src/js/products.js`، `src/js/product-details.js` و `src/css/contact.css`؛ نسخهٔ فعال در `components`/`pages` باقی است.
- حذف پوشهٔ قدیمی `src/styles`؛ مرجع واحد استایل `src/css` است.
- حذف `PRODUCTS-PAGE-SETUP.md` که هنوز مسیر منسوخ `/src/assets` و ساختار دوصفحه‌ای را توضیح می‌داد؛ توضیح جاری همین README است.
- فرم‌های مشاورهٔ نمایشی با `data-pending-form` به handler مشترک منتقل شدند؛ no-opهای تکراری حذف شدند و فرم‌های Home دیگر reload ناخواسته ندارند.
- فرم تماس و فرم جزئیات محصول handler اختصاصی‌شان را حفظ کرده‌اند.
- ساخت chip هواسازها با DOM/textContent جایگزین interpolated innerHTML شد؛ سبک و رفتار آن حفظ شده است.
- checkerها اکنون Auth، ثبت همهٔ HTMLها، import CSS و assetهای JS را هم کنترل می‌کنند؛ اشاره به مستندات ناموجود حذف شده است.
- README یکپارچه، با Markdown سالم و بدون تاریخچهٔ تکراری بازنویسی شد.
- dependency جدیدی به پروژه اضافه نشده است. CSS/JS هر صفحه مستقل باقی مانده؛ بازنویسی بصری صفحات قبلی انجام نشده است.

## Assetها و فونت‌ها

| فایل واقعی                    | URL در HTML/CSS         |
| ----------------------------- | ----------------------- |
| `public/assets/images/...`    | `/assets/images/...`    |
| `public/assets/icons/...`     | `/assets/icons/...`     |
| `public/assets/logos/...`     | `/assets/logos/...`     |
| `public/assets/documents/...` | `/assets/documents/...` |
| `public/fonts/...`            | `/fonts/...`            |

`docs/assets-manifest.json` مسیرهای موجود در سورس را ثبت می‌کند؛ به معنی وجود فایل واقعی نیست.
در این تحویل ۱۵۴ مسیر referenced شناسایی شد و هیچ‌کدام از تصاویر/فونت‌های کاربر در ZIP ورودی نبودند.
مسیرها و پسوندهای فایل‌های کاربر حفظ شده‌اند؛ asset آزمایشی یا تصویر جایگزین به پروژه اضافه نشده است.

| وزن Peyda | نام فایل در `public/fonts`        |
| --------- | --------------------------------- |
| 100       | `Peyda-Thin[@fontbazi].ttf`       |
| 200       | `peyda-extralight[@fontbazi].ttf` |
| 300       | `peyda-light[@fontbazi].ttf`      |
| 400       | `Peyda-Regular[@fontbazi].ttf`    |
| 500       | `Peyda-Medium[@fontbazi].ttf`     |
| 600       | `Peyda-SemiBold[@fontbazi].ttf`   |
| 700       | `Peyda-Bold[@fontbazi].ttf`       |
| 800       | `Peyda-ExtraBold[@fontbazi].ttf`  |
| 900       | `Peyda-Black[@fontbazi].ttf`      |

مسیرهای حساس: تصاویر expertise و آیکن‌هایش PNG؛ experience در about یک SVG؛ Textile و Industries ترکیب SVG/PNG/WebP و fallback دارند. نام و بزرگی/کوچکی حروف مطابق سورس حفظ شود.

## تغییرات Pattern و Hero — ۲۰۲۶-۰۹-۲۶

- خروجی `pattern-final.zip` به renderer مشترک پروژه منتقل شد؛ Text/Brand نمونهٔ فایل export نمایش داده نمی‌شود و فقط geometry/animation خود Pattern استفاده می‌شود.
- Header صفحهٔ اصلی از Pattern جدید مستثناست تا Hero تصویری Landing دست‌نخورده بماند.
- Footer تمام صفحات Pattern مشترک دارد و برای خوانایی متن با opacity کمی کمتر Render می‌شود.
- Patternهای قدیمی/محلی در Headerهای Products، Contact، Product Details و Project Details حذف یا غیرفعال شدند تا دو Pattern روی هم نیفتند.
- Breadcrumb/eyebrow بالای صفحات با آبی برند `#79B6ED` یکپارچه شده؛ Breadcrumbهای Project Details و Product Details نیز کامل آبی هستند.
- فاصلهٔ متن Hero تا Header در صفحات داخلی فشرده‌تر شد. Geometry پذیرفته‌شدهٔ `expertise.css` حفظ شده و فقط Pattern مشترک پشت آن mount می‌شود.

## بررسی این تحویل

- برای همین خروجی، `npm run check` روی سورس ۱۱ صفحه‌ای اجرا شد و PASS است.
- بررسی ساختاری شامل یک header/footer/menu/auth، entry صحیح، importها، IDهای یکتا و مقصد لینک‌های داخلی است.
- `npm run build` در محیط این مرحله قابل اجرا نبود چون نصب `vite`/`node_modules` کامل نشد؛ این مورد به‌عنوان خطای سورس گزارش نشده است.
- `check:assets` بعد از افزودن `public` واقعی پروژه باید روی سیستم مقصد دوباره اجرا شود.
- هیچ Backend یا سرویس واقعی پیامک/ایمیل در این مرحله تست نشده است.
- بدون assetهای واقعی، Pixel Match کامل فونت، تصویر و پس‌زمینه قابل تأیید نیست؛ قبل از تحویل مشتری فونت و assetهای خود پروژه اضافه شوند.

## موارد باز

1. اتصال Auth به ASP.NET Core، سرویس کد تأیید و session واقعی؛ سپس پنل کاربری و رفتار بعد از login.
2. API فرم تماس/مشاوره، اعتبارسنجی فایل سمت سرور و جستجو/فیلتر واقعی محصولات و صنایع.
3. مقصد نهایی کارت‌ها، مقالات، دانلودها و شبکه‌های اجتماعی؛ ۲۹۲ لینک placeholder در HTMLهای renderشده وجود دارد که بخشی از آن‌ها تکرار اجزای مشترک است.
4. تغییر زبان و مدل 3D واقعی محصول.
5. بازبینی Crop/Cover بعضی PNGهای Expertise با asset و screenshot واقعی؛ فعلاً باز طبق تصمیم کاربر.
6. افزودن public اصلی، اجرای `check:assets` و بررسی بصری نهایی روی دستگاه/مرورگر مقصد.

## قرارداد صفحهٔ جدید و چت بعدی

برای صفحهٔ تازه فقط این سه فایل ساخته شود:

```text
page-name.html
src/css/pages/page-name.css
src/js/pages/page-name.js
```

entry استاندارد:

```js
import "../../css/main.css";
import "../../css/pages/page-name.css";
import { initSite } from "../main.js";

initSite();
// رفتار اختصاصی همین صفحه
```

در HTML، header/footer با includeهای مشترک قرار بگیرند. منو و Auth مستقیم زیر body و خارج از wrapperهای صفحه بمانند:

```html
<!-- @include footer -->
<!-- @include mobile-menu -->
<!-- @include auth-modal -->
<script type="module" src="/src/js/pages/page-name.js"></script>
```

عضو تازه به `build/pages.js` اضافه شود؛ عضوهای قبلی حذف نشوند. صفحه فقط یک module entry دارد و `initSite()` یک بار اجرا می‌شود.
CSS صفحه داخل `main.css` import نشود؛ CSS کپی‌شده از Markdown از نظر NBSP، escape و کاراکتر نامرئی بررسی شود.

برای ادامه، همین README + طرح دسکتاپ/موبایل صفحهٔ جدید کافی است. اگر قرار است فایلی موجود ویرایش شود و کاربر آن را تغییر داده، نسخهٔ تازهٔ همان فایل هم لازم است؛ از روی README سورس قبلی بازسازی نشود.

دستور پیشنهادی چت بعد:

> این README را بخوان و پروژهٔ مارپیچ صنعت را با همین ساختار ادامه بده. هدر، فوتر، منو و Auth مشترک هستند؛ آن‌ها را دوباره نساز. برای صفحهٔ جدید HTML + CSS/JS اختصاصی و ثبت در build/pages.js لازم است. RTL و Tailwind-first رعایت شود. صفحات تثبیت‌شده فقط در صورت اختلاف مشخص تغییر کنند. assetها در public هستند. بعد از هر مرحله، README را یکپارچه به‌روز کن و فقط تست‌هایی را گزارش بده که واقعاً اجرا شده‌اند.

## UI refinement — 2026-09-26

- Home hero CTA uses the approved orange gradient (`#F76E11 → #F08000`). Secondary CTA is fully transparent and only has the approved 2px blue gradient stroke; no glass/background fill remains.
- Hero CTA arrows are real SVG assets under `public/assets/icons/cta/` instead of Font Awesome.
- Mobile/tablet shared consultation form is RTL and right-aligned; because this is a shared partial it affects Home, About and Expertise.
- Media category badges were made shorter and normalized to the same `#79B6ED` visual language on Home, Products, Air Handling, Industries, Projects and Industry Textile.
- Card-like boxes now use the shared `--shadow-card` design token; focus rings and CTA button shadows stay independent.
- Featured-project supporting copy on Home is slightly larger and uses `#717171`.

### 2026-09-26 — Home hero CTA / consultation refinement
- Home secondary CTA now uses the approved 2px inside-style blue gradient stroke (`#65B1F5` at 46% → 100% → 75% opacity).
- Desktop hero CTA content offsets are fixed to Figma: consultation text 36px/right + arrow 23px/left; products text 23px/right + arrow 15px/left. Smaller breakpoints use proportional offsets.
- Shared consultation form is right-anchored from 563px through 1023px while keeping its fields/text RTL.

### 2026-09-26 — Catalog components consolidation
- `product-card.html` is now the only product-card template for Products and Air Handling; the old `product-card-air-handling.html` was removed.
- `catalog-consultation.html` is shared by Products, Air Handling and Industries. Air Handling is the layout baseline; fields are RTL/right-aligned, accent height is 2px, desktop radius is 16px and widths below 1180px use 8px. The submit button now sizes to its content (no fixed/capped visual width), uses the Figma gradient `#F76E11 → #F4824C`, the provided 24px SVG arrow at 12px from the left, and 8px right padding for the text.
- `src/css/components/catalog.css` is imported after the relevant page CSS and is the source of truth for shared Search/Filter, Product Grid/Card and Catalog CTA styles.
- Product filter clear action follows the active chips on their left with normal component gap; it is not pushed to either outer edge.
- Products hero spacing below the shared header was reduced to 154px desktop, 140px tablet and 124px mobile.
- Home Hero CTA baseline preserved: desktop columns 220px consultation + 180px products with 12px gap; secondary remains transparent with gradient stroke only.

### 2026-09-26 — Expertise responsive refinement
- Expertise hero spacing below the shared header was reduced page-locally; the shared header component itself was not changed.
- The “مزایای کلیدی این خدمت” heading is vertically centered against the two-row benefits grid from tablet upward, matching the supplied reference.
- Expertise card artwork now uses responsive overscan below 1180px (stronger below 768px) so the image continues to cover the full media box without thin empty bands at the top/bottom.


### 2026-09-26 — Industries layout refinement
- Industries now relies on the shared `src/css/components/catalog.css` Search/Filter component instead of page-local duplicate search styles.
- Desktop/tablet hero spacing was tightened without changing the shared header.
- Featured industry text is top/right aligned; the link underline in this first mosaic was removed.
- Mobile featured mosaic matches the supplied reference order: Textile → Laboratory → Healthcare, then Pharma spanning the left column with Petrochemical/Other stacked on the right.
- “صنایع تحت پوشش” cards were normalized to the approved catalog-card geometry/tokens (shared border, radius, shadow, badge language).
- The user-approved `expertise.css` values remain the baseline in this full-project handoff (including 101% base media width and 107% tablet overscan).

## 2026-09-26 — Industries card unification

- Industries `صنایع تحت پوشش` cards now reuse the shared `product-card` catalog styling used by Products/Air Handling; only the two-chip industry metadata layout remains page-specific.


## 2026-09-26 — v8 UI consistency pass

- `industry-textile`: summary separators now use the approved Figma gradient stroke (`#F2F6FF → #79B6ED → #F2F6FF`), FAQ separators use `#79B6ED 31% → #E4EDFF`, project detail links have a text underline, and the bottom CTA now reuses `catalog-consultation`.
- `projects`: project cards use the shared `site-card-surface` visual treatment and the bottom form now reuses `catalog-consultation`.
- `contact`: branch address/contact typography was increased to match the supplied reference while keeping existing layout geometry.
- `about`: box-like media/cards consistently use `--shadow-card`; certificate artwork itself explicitly has no CSS shadow/filter, while the certificate card retains the shared shadow.
- `catalog-consultation` styling is now component-scoped so it can be reused safely outside Products/Air Handling/Industries.

### Contact page final alignment fix — 2026-09-26

- Office details now use explicit rows: labels stay in one right-hand column and all values align consistently beside them, matching the approved contact reference.
- The RFQ/form area now uses the same `#F4F7FD` page background as the office-card area, removing the unintended background band between sections.
- No shared Header/Footer/Catalog/Expertise styling was changed in this pass.


### Contact office-card sizing/alignment fix — 2026-09-26

- Desktop office cards are restored to 295px height so the full contact details and both action buttons remain visible inside each card.
- Office detail labels remain right-aligned in their fixed right-hand column; corresponding values now align flush to the left side of the details area, matching the supplied layout reference.
- No shared components or other page styles were changed in this pass.


## 2026-09-26 — Project Details + Product Details final alignment

- `project-details`: project meta separators use the same soft blue gradient language as `industry-textile`; product boxes reuse the shared `.site-card-surface`; the employer-comment divider now sits after the quote and before commenter metadata.
- `product-details`: stock badge uses `#ECF9F0` with `#DEF1E9` stroke; the upper 2×2 info-grid dividers are recreated directly in CSS with the same tapered Figma-style center-weighted line, so no divider SVG assets are required; the download action uses the shared orange gradient (`#F76E11 → #F4824C`) and keeps its SVG icon at the left.
- The lower Product Details consultation form now uses the shared `catalog-consultation` component and shared catalog form styling.
- Product Details icon slots are under `public/assets/icons/product-details/`: `delivery.svg`, `standards.svg`, `warranty.svg`, `support.svg`, `download.svg`. They are safe placeholders and can be overwritten one-for-one with the exact exported Figma SVGs without code changes.


### 2026-09-26 — v13 detail-page correction

- `project-details`: the employer-comment divider is now rendered after the quote and before commenter metadata, while the existing quote spacing is preserved.
- `product-details`: the 2×2 quick-spec internal separators no longer depend on `Line 41/42` SVG files; both horizontal and vertical tapered lines are generated directly with CSS gradients.

### 2026-09-26 — v14 technical-table + shared-form refinement

- `product-details`: the CAD/request-file action and the outer technical-specification frame now use `#0F172B`; toolbar icons below the main product image use `#79B6ED`; the datasheet button keeps the approved `#F76E11 → #F4824C` gradient and its download SVG is inset farther from the left edge.
- `product-details`: technical-table internal separators are intentionally lighter than the outer `#0F172B` frame to match the supplied Figma reference, while the outer frame remains the strongest border.
- `project-details`: the technical diagram/table/note now share one rounded `#0F172B` outer frame; table/diagram separators and row rules use the lighter internal-line treatment from the supplied reference, and the technical note sits inside the same frame.
- `project-details`: the custom page-only CTA form was replaced with the shared `catalog-consultation` component. Its content is supplied from `src/data/pages/project-details.json`, so the form styling stays synchronized with the other approved consultation sections.
