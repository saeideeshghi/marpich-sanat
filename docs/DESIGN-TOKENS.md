# نام‌گذاری متغیرهای استایل

برای سقف نمایشگر بزرگ، `--site-layout-max-width` را تغییر بده. خانوادهٔ `--header-fixed-*` تنظیمات منوی ثابت را کنترل می‌کند؛ همان فیلدها در میانبر «منوی ثابت» نیز توضیح داده شده‌اند.

راهنمای کامل و قابل جست‌وجو در `/tools/design-tokens.html` است. در کاستومایزر از تب «راهنمای متغیرها» استفاده کن تا مقدار زندهٔ همان صفحه را ببینی و مقدار جدید را مستقیم در همان کارت اعمال کنی. فهرست از سورس ساخته می‌شود؛ جدول زیر فقط نمونه‌های کلیدی است.

نام هر متغیر شامل بخش و ویژگی است: `--hero-title-font-size` یعنی اندازهٔ فونت عنوان هیرو، نه ارتفاع یا رنگ آن. پسوند `desktop`، `tablet` و `mobile` ورودی دستگاه است؛ نام بدون پسوند مقدار فعال همان عرض را نشان می‌دهد.

| نام فعلی                                  | کاربرد                                              | فایل مرجع                                 |
| ----------------------------------------- | --------------------------------------------------- | ----------------------------------------- |
| `--hero-eyebrow-font-size`                | اندازهٔ متن بالای عنوان هیرو                        | `src/css/type-settings.css`               |
| `--hero-title-font-size`                  | اندازهٔ عنوان هیرو                                  | `src/css/type-settings.css`               |
| `--hero-description-font-size`            | اندازهٔ توضیح هیرو                                  | `src/css/type-settings.css`               |
| `--hero-title-line-height`                | فاصلهٔ خطوط عنوان هیرو                              | `src/css/type-settings.css`               |
| `--hero-content-padding-top`              | فاصلهٔ بالای محتوای هیرو                            | `src/css/type-settings.css`               |
| `--hero-content-padding-bottom`           | فاصلهٔ پایین محتوای هیرو                            | `src/css/type-settings.css`               |
| `--hero-min-height-desktop/tablet/mobile` | حداقل ارتفاع هیروی هر صفحه، روی ID همان هیرو        | `src/css/hero-heights.css`                |
| `--hero-summary-overlap-preferred`        | هم‌پوشانی پیشنهادی باکس زیر هیرو                    | `src/css/type-settings.css`               |
| `--hero-summary-overlap`                  | مقدار امن محاسبه‌شدهٔ هم‌پوشانی؛ با JS تنظیم می‌شود | `src/js/components/hero.js`               |
| `--card-title-font-size`                  | اندازهٔ عنوان کارت                                  | `src/css/type-settings.css`               |
| `--card-description-font-size`            | اندازهٔ توضیح کارت                                  | `src/css/type-settings.css`               |
| `--card-link-font-size`                   | اندازهٔ لینک کارت                                   | `src/css/type-settings.css`               |
| `--card-tag-font-size`                    | اندازهٔ پایهٔ برچسب‌ها                              | `src/css/type-settings.css`               |
| `--card-media-tag-font-size`              | اندازهٔ مستقل تگ روی تصویر؛ پیش‌فرض اندازهٔ پایه    | کاستومایزر / `card-type.css`              |
| `--card-meta-tag-font-size`               | اندازهٔ مستقل تگ زیر متن؛ پیش‌فرض اندازهٔ پایه      | کاستومایزر / `card-type.css`              |
| `--body-font-size`                        | اندازهٔ متن معمولی                                  | `src/css/type-settings.css`               |
| `--section-title-font-size`               | اندازهٔ عنوان بخش                                   | `src/css/type-settings.css`               |
| `--site-gutter`                           | فاصله از لبهٔ صفحه                                  | `src/css/layout-settings.css`             |
| `--card-radius`                           | گردی پایهٔ کارت                                     | `src/css/layout-settings.css`             |
| `--technical-text-color`                  | رنگ متن جدول فنی؛ قبلاً `--ink`                     | `src/css/components/detail-technical.css` |
| `--technical-background-color`            | زمینهٔ جدول فنی؛ قبلاً `--panel`                    | همان فایل و تم جزئیات پروژه               |
| `--technical-border-strong-color`         | حاشیهٔ پررنگ جدول؛ قبلاً `--line-strong`            | همان فایل و تم جزئیات پروژه               |
| `--air-handling-muted-text-color`         | متن کم‌رنگ هواساز؛ قبلاً `--ah-muted`               | `src/css/pages/air-handling.css`          |
| `--industries-card-background-color`      | زمینهٔ کارت صنایع؛ قبلاً `--ind-card`               | `src/css/pages/industries.css`            |
| `--partners-logo-height`                  | ارتفاع لوگوی مشتریان                                | `src/css/pages/home.css`                  |
| `--partners-scroll-duration`              | مدت حرکت نوار مشتریان                               | همان فایل و `partners.js`                 |

برای ارتفاع هدر/هیرو، صفحه را در کاستومایزر انتخاب کن و دکمهٔ مربوط را بزن. تغییر دستی مقدارهای responsive را در فایل مرجع انجام بده؛ CSS تولیدی `template-overrides.css` را دستی تغییر نده.

| کلاس                    | کاربرد                                                     |
| ----------------------- | ---------------------------------------------------------- |
| `site-card__media-tag`  | برچسب روی عکس                                              |
| `site-card__meta-tag`   | مشخصات و متادیتا زیر متن؛ پدینگ بالای 8px                  |
| `site-card__status-tag` | وضعیت موجودی محصول                                         |
| `site-card__meta-row`   | ردیف حاوی مشخصات؛ فاصلهٔ بیرونی ردیف مستقل از پدینگ تگ است |

نام قدیمی `site-card__tag` از markup حذف شده است. JSON قدیمی را از Import وارد کن تا targetها تبدیل شوند؛ CSS قدیمی را روی نام‌های حذف‌شده بازنویسی نکن. نام‌های قبلی چهار متغیر عمومی فونت نیز هنگام Import به نام جدید تبدیل می‌شوند. مقادیر و ترتیب باقی تنظیمات حفظ می‌شوند؛ قوانین مستقیم یک المان ممکن است بر توکن عمومی مقدم باشند.

## ویرایش از کارت راهنما

۱۷۴ متغیر، فرم مستقیم دارند: رنگ HEX یا rgb با alpha، طول با واحد یا calc/clamp، عدد بدون واحد، عدد صحیح، نسبت تصویر، سایه و نام فونت. محدودهٔ صفحه و اندازه بالای همان تب انتخاب می‌شود. بازنشانی تنها تغییر همان متغیر در همان محدوده را حذف می‌کند. قوانین در `settings.json` با `target.kind: "token"` ذخیره می‌شوند و در CSS تولیدی روی مالک محلی متغیر هم اعمال می‌شوند.

خروجی‌های اندازه‌گیری خودکار و breakpoint زمان ساخت، دلیل و مسیر تنظیم را در کارت نشان می‌دهند. قوانین مستقیم property در تب استایل می‌توانند از متغیر مقدم باشند. ستونِ مقدار زنده را کنار نتیجهٔ واقعی پیش‌نمایش بررسی کن.

قرارداد مجاز نام، نوع ورودی و مالک محلی در `src/data/customizer/token-contract.json` است. پس از اضافه‌کردن یا جابجایی متغیر در CSS، `npm run tokens:refresh` و سپس `npm run check` را اجرا کن. فهرست راهنما از سورس خوانده می‌شود و کنترل، نام ناشناخته یا ورودی اجرایی نمی‌پذیرد.
