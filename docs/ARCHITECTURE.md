# ساختار و قراردادهای کد

## جریان اجرا

`build/pages.js` مرجع ۱۲ ورودی و active navigation است. `build/html-partials.js`، root HTML را با `src/components` و JSON هر صفحه ترکیب می‌کند؛ renderer در `build/components.js` متن را escape و URLها را کنترل می‌کند. این ترکیب در زمان اجرا/Buildِ Vite انجام می‌شود، نه با fetch قالب در مرورگر.

هر صفحه یک entry در `src/js/pages` دارد. `src/js/main.js` رفتار مشترک را یک بار مقداردهی می‌کند و سپس `site:ready` را منتشر می‌کند. JS کامپوننت‌ها در `src/js/components` قرار دارد؛ `data-*` قرارداد رفتار است.

## ترتیب CSS

1. `src/css/main.css`: Tailwind، توکن‌ها، فونت و بخش‌های مشترک سایت.
2. CSS اختصاصی صفحه و کامپوننت‌های مرتبط؛ importهای فعلی entry هر صفحه ترتیب مرجع‌اند.
3. `components/content-flow.css`: جریان محتوا، متن‌ها و تعامل‌ها.
4. `responsive.css`: کارت‌ها، typography، ارتفاع Hero و چیدمان responsive.
5. در `project-details`، فایل `project-details-theme.css` پس از responsive، ظاهر تأییدشدهٔ باکس بالایی، جدول، دستاوردها و دیدگاه را اعمال می‌کند.
6. stylesheet مستقل Customizer در انتهای head، تنظیمات تأییدشده را اعمال می‌کند. پیش‌نمایش فقط همین link را با draft جایگزین می‌کند.

لایهٔ پایانی پروژه حذف نشده چون ترتیب آن بخشی از ظاهر تأییدشده است. استایل عمومی را در فایل صفحه ننویس؛ استایل صفحه را با root صفحه یا نام کلاس همان صفحه محدود کن.

## قرارداد کلاس‌ها

| نوع        | الگو                         | کاربرد                                   |
| ---------- | ---------------------------- | ---------------------------------------- |
| بخش مشترک  | `site-footer`                | Block مشترک                              |
| جزء مشترک  | `site-footer__layout`        | Element داخل Block                       |
| حالت ظاهری | `site-nav-dropdown--compact` | Modifier                                 |
| صفحه       | `project-details__summary`   | بخش مخصوص همان صفحه                      |
| رفتار      | `data-menu-open`             | Hook مربوط به JS                         |
| utility    | `flex`, `gap-4`              | Tailwind؛ selector عمومی Customizer نساز |

نام‌های موجودِ وابسته به CSS، JSON و JS حفظ شده‌اند. Hookهای زیر به markup اضافه شده‌اند تا استایل مشترک بر ترتیب DOM یا utilityها تکیه نکند:

- `site-card-grid`
- `site-card__media`
- `site-card__image`
- `site-card__body`

Hookهای قبلی عنوان، توضیح، تگ و CTA نیز حفظ شده‌اند. برای کامپوننت جدید همین قرارداد را رعایت کن. از `nth-of-type` برای قوانین عمومی اجتناب کن؛ ویرایش دقیق المان در Customizer می‌تواند برای انتخاب یک نمونه از آن استفاده کند.

## Customizer

| ماژول                                    | مسئولیت                                                |
| ---------------------------------------- | ------------------------------------------------------ |
| `schema.js`                              | بخش‌ها، اندازه‌ها و قرارداد propertyها                 |
| `values.js`                              | اعتبارسنجی مقدار و ساخت media query                    |
| `model.js`                               | نرمال‌سازی، کلید قانون و تولید CSS                     |
| `controls.js`                            | کنترل‌های UI و واحدها                                  |
| `picker.js`                              | selector دقیق و مشترک و مسیر انتخاب                    |
| `editor.js`                              | state، تاریخچه، preview و ذخیره                        |
| `pattern-model.js` / `pattern-editor.js` | اعتبارسنجی و کنترل artwork                             |
| `export.js`                              | ZIP قابل انتقال با مسیرهای واقعی پروژه                 |
| `build/design-config.js`                 | ترکیب تنظیمات قواعد با دو فایل مرجع پترن               |
| `build/customizer.js`                    | endpoint محلی، revision، ذخیره و snapshot خروجی Static |

فایل sourceِ `settings.json` artwork را تکرار نمی‌کند. snapshot خروجی Static شامل پترن‌هاست تا ویرایشگر آنلاین بدون دسترسی به سورس بتواند Export کند.

## پاک‌سازی و نگهداری

فایل‌های root مربوط به patchهای قدیمی، چهار قالب بدون مصرف و سه stylesheet بدون import حذف شده‌اند. `layout-checks.css` به `components/content-flow.css` و `project-details-reference.css` به `project-details-theme.css` تغییر نام داده‌اند. مسیرها در importها اصلاح شده‌اند.

بخش‌های CSS مربوط به CTAهای قدیمی کنارگذاشته‌شده و declarationهای کاملاً یکسان حذف شدند. media queryها مرتب‌سازی سراسری نشده‌اند چون ترتیبشان بر cascade اثر دارد. محتوای صفحات، IDها، رویدادهای فرم و assets دستکاری نشده‌اند.

برای نسخهٔ قبلی روی سیستم، `npm run clean:legacy -- --apply` فقط فایل‌های مشخصِ منسوخ را حذف می‌کند. فهرست در `docs/obsolete-files.json` قابل بررسی است.
