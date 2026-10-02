# آپلود نسخه نهایی مارپیچ صنعت

نسخه قابل‌خواندن در مرورگر: `docs/GITHUB-UPLOAD.html`.

این بسته اصلاحات پترن، ارتفاع هیرو، CTA، منوی فعال موبایل، اسلایدر مشتریان، SVGهای فرایند همکاری، متن جاستیفای ۱۴px و underline فقط زیر متن را دارد. ادیتور مستقل فوتر در `tools/footer-pattern-studio.html` است. پیش‌نویس ادیتور جایگزین خودکار پترن تأییدشده سایت نشده است.

## چرا نسخه قبلی دیده می‌شد؟

Push با `fetch first` رد شده بود، بنابراین اصلاحات هنوز روی branch اصلی GitHub نبودند. علاوه بر آن، تصاویر ریپو در `assets/` قرار داشتند ولی build Vite پوشه `public/` را منتشر می‌کند. تنظیمات تازه هنگام اجرا و build، دارایی‌های هر دو محل را در پوشه موقت `.cache/static-public` ادغام می‌کنند؛ فایل‌های `public` اولویت دارند. فایل‌های اصلی جابه‌جا یا حذف نمی‌شوند.

## ۱. یک Clone تمیز بگیر

در یک پوشه تازه، PowerShell را باز کن:

```powershell
git clone https://github.com/saeideeshghi/marpich-sanat.git marpich-sanat-new
cd marpich-sanat-new
```

همین ریپو و تاریخچه‌اش استفاده می‌شود. پوشه قدیمی پروژه خودت را نگه دار.

## ۲. فایل‌های نسخه نهایی را ادغام کن

ZIP نهایی را خارج از ریپو Extract کن. محتویاتش را داخل `marpich-sanat-new` کپی و Replace کن. `package.json` باید مستقیم در ریشه ریپو باشد، نه داخل یک زیرپوشه دیگر.

- `.git` نسخه Clone را حفظ کن.
- پوشه‌های تصاویر و فونت‌های Clone را حذف نکن. فایل‌های `public` بسته جدید را با آن‌ها ادغام کن.
- دارایی‌های تازه‌ای که روی سیستم خودت داری را در `public/assets` با همان نام‌های مرجع اضافه کن. `assets` در ریشه نیز پشتیبانی می‌شود.
- ZIP/RAR پروژه را داخل ریپو کپی نکن. پوشه‌های `node_modules`، `dist` و `.cache` نیز در git ثبت نمی‌شوند.

## ۳. بررسی و اجرای نسخه مخصوص Pages

Node.js 22.12 یا بالاتر لازم است. دستورها را یکی‌یکی اجرا کن:

```powershell
npm ci
npm run check
npm run check:assets
npm run build:pages
npm run preview:pages
```

Preview را در این آدرس بررسی کن:

```text
http://localhost:4173/marpich-sanat/index.html
```

اگر پورت دیگری نمایش داده شد، همان پورت را جایگزین کن. بعد با `Ctrl+C` Preview را ببند. `check:assets` فایل‌های مفقود را دقیق می‌نویسد؛ خطاهای فایل را با افزودن دارایی اصلی اصلاح کن. build موفق به معنی موجود بودن همه تصاویر نیست.

## ۴. Commit و Push

```powershell
git status
git add .
git commit -m "Update complete frontend and GitHub Pages asset handling"
git push origin main
```

اگر روی GitHub بعد از Clone تغییر دیگری ندادی، این Push بر پایه آخرین نسخه ریپو خواهد بود. اگر باز هم `fetch first` دیدی، اول با working tree تمیز `git pull --rebase origin main` اجرا کن. اگر Conflict آمد، قبل از Push باید حل شود؛ از force push برای این آپدیت استفاده نکن.

## ۵. انتشار

در Settings → Pages، گزینه Source باید GitHub Actions باشد. workflow موجود با هر Push روی `main` این کارها را انجام می‌دهد: نصب dependencyها، `build:pages` و انتشار `dist`.

وضعیت اجرا:

<https://github.com/saeideeshghi/marpich-sanat/actions>

سایت:

<https://saeideeshghi.github.io/marpich-sanat/index.html>

بعد از موفق‌شدن Deploy، با `Ctrl+F5` صفحه را تازه کن. اگر هنوز نسخه قبلی دیده شد، یک پنجره Incognito باز کن و commit و اجرای Actions را مقایسه کن.

## اجرای صحیح فایل‌ها

برای ویرایش سایت `npm run dev` اجرا کنید. بازکردن مستقیم `index.html` یا Live Server، includeهای مشترک را پردازش نمی‌کند و ظاهر ناقص نشان می‌دهد.

## فایل‌هایی که باید اضافه شوند

تصاویر سنگین در ZIP ارسالی مالک نبودند. فونت‌ها و دو SVG جدید همکاری در این بسته هستند. لیست مسیرهای موردنیاز در `docs/assets-manifest.json` است؛ گزارش مقایسه با ریپوی قدیمی در `docs/github-assets-missing.json`، فقط وضعیت زمان این تحویل را نشان می‌دهد. دارایی‌های جدید محلی را قبل از Push اضافه کن.

برای بک‌اند یا میزبانی در ریشه دامنه همچنان `npm run build` استفاده می‌شود؛ `build:pages` و `preview:pages` مخصوص ریپوی `marpich-sanat` هستند.
