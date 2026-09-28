# بررسی خروجی جاری — 2026-09-26

برای اصلاح جاری صفحه Industries، `npm run check` اجرا شد و هر ۱۱ صفحه PASS شدند. در این محیط نصب dependencyها کامل نشد و executable مربوط به `vite` در دسترس نبود، بنابراین `npm run build` و مرور بصری Chromium برای همین خروجی دوباره اجرا نشدند. سوابق پایین مربوط به بررسی نسخه‌های قبلی پروژه هستند و نباید به‌عنوان نتیجهٔ اجرای مجدد روی این خروجی تلقی شوند.

# بررسی نسخهٔ 0.3.1

نسخهٔ فعلی از `01-fix.zip` ساخته شده است. تمام فایل‌های `src/css` آن بدون تغییر حفظ شده‌اند؛ بخش‌های مشترک در مرحلهٔ ساخت از `src/components` و `src/data/pages` وارد می‌شوند. `npm run check` و `npm run build` برای ۱۱ صفحه موفق بودند.

در Chromium خروجی نسخهٔ اولیه و اصلاح‌شده در عرض‌های 320، 393، 768، 1024، 1180 و 1440 برای ۱۱ صفحه از نظر چیدمان، رنگ و تایپوگرافی مقایسه شد؛ ۱۶ اسکرین‌شات تمام‌صفحه از ۸ صفحه در 393 و 1440 پیکسل پیکسل‌به‌پیکسل یکسان بودند. آزمون‌های عملی نمای grid/list در چهار صفحه، فیلتر/پاک‌کردن/جستجو در سه صفحه، همگام‌ماندن فرم مشاوره در موبایل و دسکتاپ، FAQ و نظرات بدون خطای جاوااسکریپت گذشت. تصاویر و فونت‌های حذف‌شده از ورودی در این تطبیق حضور ندارند؛ بعد از افزودن asset واقعی، مرور ظاهری نهایی لازم است.

## سوابق بررسی نسخهٔ 0.2.0

بررسی روی سورس همین ZIP و بدون assetهای حذف‌شدهٔ کاربر انجام شده است.

## Build و ساختار

- نصب dependencyها با `npm ci` موفق بود؛ dependency جدیدی به پروژه اضافه نشده.
- `npm run check` برای هر ۱۱ صفحه موفق است: یک entry، header، footer، mobile menu و auth modal؛ importهای CSS صحیح، IDهای یکتا و لینک‌های داخلی معتبر.
- بررسی syntax هر ۲۱ فایل JavaScript موفق بود.
- `npm run build` برای هر ۱۱ صفحه موفق بود.
- `check:assets`: تعداد ۱۵۴ مسیر referenced و صفر فایل واقعی؛ این نتیجه با ZIP ورودیِ بدون public مطابقت دارد. بعد از کپی assets/fonts باید این فرمان روی سیستم کاربر دوباره اجرا شود.

## مرورگر

Chromium headless با Playwright؛ رفتارها روی مرورگر اجرا شدند، نه فقط با بررسی متن کد.

- اعتبارسنجی شماره/ایمیل، فیلدهای خالی و تکرار رمز.
- نمایش/پنهان کردن رمز، انتخاب remember و تغییر فرم‌ها.
- پیش‌نمایش مسیر ثبت‌نام و تأیید حساب.
- فراموشی رمز → کد تأیید → رمز جدید → ورود.
- کد ناقص/نادرست، پذیرش رقم فارسی/عربی و توزیع یک کد کامل در شش خانه.
- تایمر ارسال مجدد با گذر زمان شبیه‌سازی‌شده، شماره با پیش‌شماره +98 و ویرایش شناسه.
- Escape، کلیک backdrop، نگه‌داشتن focus داخل پنجره، بازگشت focus و پاک‌شدن رمز هنگام بستن.
- انتقال از منوی موبایل به modal و بازگشت به همبرگر، بدون باقی‌ماندن inert یا scroll lock.
- چهار حالت اصلی در عرض‌های 320، 393، 768، 1179، 1180 و 1440 پیکسل؛ کنترل خارج‌نشدن modal از viewport و نداشتن overflow افقی داخل آن.
- صفحهٔ کوتاه 393×350: اسکرول داخلی و دسترسی به فرم و validation.
- production بدون تنظیم API: preview غیرفعال است، درخواست واقعی ارسال نمی‌شود و ورود موفق ساختگی نمایش داده نمی‌شود.

- راه‌اندازی Auth روی هر ۱۱ صفحه، فرم نمایشی Home و نبود اطلاعات حساب در localStorage/sessionStorage بررسی شد.
- API با پاسخ‌های mock برای 401، پاسخ نامعتبر، 429 و cooldown، تأیید موفق، resetToken و لغو پاسخ دیررس تست شد؛ هیچ پیامک یا ایمیل واقعی ارسال نشده است.
- در کل این اجراها خطای JavaScript صفحه ثبت نشد.

## محدودیت تأیید

- فونت Peyda و تصاویر پروژه در ورودی نبودند؛ screenshots با فونت fallback و پس‌زمینهٔ ناقص بررسی شدند. تطبیق پیکسلی نهایی با فونت و asset واقعی بر عهدهٔ مرحلهٔ بعد است.
- OTP واقعی، سرویس پیامک/ایمیل، session، CSRF و اتصال ASP.NET Core موجود نبود و در این مرحله تأیید نشده است.
- پنل کاربری، جستجو/فیلتر واقعی، مقصد تمام placeholderها و اصلاح تصاویر Expertise خارج از تکمیل این مرحله‌اند.
- بررسی responsive بالا روی Chromium انجام شده؛ Safari/iOS واقعی در دسترس نبود.


## 2026-09-26 v12 validation

- `npm run check`: PASS for all 11 pages after the `project-details` / `product-details` updates.
- The two user-supplied Product Details divider SVGs are present under `public/assets/icons/product-details/`.
- `npm run build` could not be completed in this environment because the Vite executable is not installed; source/component validation remains green.
- The project ZIP intentionally does not include the original full `public/assets` / `public/fonts` library, so `npm run check:assets` continues to report those pre-existing missing assets.
