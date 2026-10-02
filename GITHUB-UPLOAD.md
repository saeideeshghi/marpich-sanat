# آپدیت همین پروژه روی GitHub

ریپو: https://github.com/saeideeshghi/marpich-sanat

شاخه انتشار: `main`

سایت: https://saeideeshghi.github.io/marpich-sanat/index.html

## روش ثابت هر بار

۱. بسته اصلاحات را خارج از پروژه Extract کن. **محتویات داخل بسته** را کنار `package.json` در ریشه همان پروژه قبلی کپی و Replace کن. پوشه‌های `src` و `public` با نسخه موجود ادغام شوند؛ تصاویر، فونت‌ها و تاریخچه Git را حذف نکن.

۲. همان پوشه را در VS Code باز کن. در **Terminal → New Terminal** اجرا کن:

```powershell
.\PUSH-GITHUB.cmd
```

این فایل Windows، نام ریپو و شاخه را بررسی می‌کند؛ Check و Build مخصوص Pages را اجرا می‌کند، تغییرات را Commit می‌کند، با `origin/main` همگام می‌کند و Push می‌کند. اگر dependencies نصب نیستند ابتدا `npm ci` اجرا می‌شود. روی اولین خطا توقف می‌کند. Tagها جابه‌جا نمی‌شوند.

۳. [Actions پروژه](https://github.com/saeideeshghi/marpich-sanat/actions) را باز کن. وقتی اجرای جدید **Deploy website to GitHub Pages** سبز شد، سایت را با **Ctrl + F5** تازه کن. Workflow فعلی Build و Deploy را انجام می‌دهد؛ `dist` را دستی آپلود نکن.

## اجرای دستی همین مراحل

دستورها را یکی‌یکی اجرا کن؛ بعد از خطا مرحله بعد را اجرا نکن:

```powershell
git status
npm.cmd run check
npm.cmd run build:pages
git add -A
git commit -m "Update v2 frontend"
git pull --rebase origin main
git push origin main
```

`git status` باید `On branch main` نشان دهد. اگر dependencies نصب نیستند قبل از Check، `npm.cmd ci` اجرا کن. اگر Commit نوشت `nothing to commit`، تغییر جدیدی باقی نمانده و می‌توانی دو دستور آخر را اجرا کنی.

## اجرای محلی

```powershell
npm.cmd run dev
```

آدرس ترمینال را باز کن. برای Preview مسیر Pages، بعد از `build:pages` اجرا کن:

```powershell
npm.cmd run preview:pages
```

آدرس معمول: http://localhost:4173/marpich-sanat/index.html

اگر پورت متفاوتی نمایش داده شد، همان را استفاده کن. سرور با **Ctrl + C** بسته می‌شود. بازکردن HTML مستقیم یا Live Server، includeهای مشترک را پردازش نمی‌کند.

## خطاهای رایج

| پیام | اقدام |
| --- | --- |
| `not a git repository` | همان پوشه‌ای را باز کن که قبلاً Push کردی. اگر فقط ZIP داری، روش Clone پایین را اجرا کن. |
| شاخه `main` نیست | با `git status` شاخه و تغییرات را بررسی کن. |
| Remote تطبیق ندارد | `git remote -v` باید همین ریپوی `saeideeshghi/marpich-sanat` باشد. |
| `npm.ps1 cannot be loaded` | از `npm.cmd` یا `PUSH-GITHUB.cmd` استفاده کن؛ تغییر Execution Policy لازم نیست. |
| Check یا Build ناموفق | خطای دقیق را اصلاح کن و دوباره فایل Push را اجرا کن. |
| خطای شبکه یا ورود | اتصال یا احراز هویت GitHub را کامل کن و دوباره اجرا کن. رمز یا Token را داخل فایل‌ها ننویس. |
| `CONFLICT` | فایل‌های Conflict را در VS Code حل کن، سپس دستورهای زیر را اجرا کن. |
| `fetch first` / `non-fast-forward` | بعد از Commit محلی، `git pull --rebase origin main` و سپس Push کن. |
| Actions قرمز شد | اجرای جدید را باز کن و خطای مرحله ناموفق را بررسی کن. |

بعد از حل Conflict در Rebase:

```powershell
git add -A
git rebase --continue
npm.cmd run check
npm.cmd run build:pages
git push origin main
```

`git rebase --abort` همگام‌سازی ناموفق را لغو می‌کند و Commit محلی خودت حفظ می‌شود. برای آپدیت معمول این پروژه از `git push --force` استفاده نکن.

## اگر پوشه فعلی Git ندارد

فقط در این حالت در یک پوشه تازه اجرا کن:

```powershell
git clone https://github.com/saeideeshghi/marpich-sanat.git marpich-sanat
cd marpich-sanat
```

اصلاحات و دارایی‌های محلی جدید را در ریشه این Clone ادغام کن و روش ثابت بالا را اجرا کن. پوشه قبلی خودت را نگه دار.

## v2 و Tag

سایت از آخرین Commit روی `main` ساخته می‌شود و آدرسش ثابت می‌ماند. Tag قدیمی `v2.0.0` تصویر ثبت‌شده همان زمان است و با Push معمولی تغییر نمی‌کند. این روال اصلاحات v2 را روی سایت منتشر می‌کند و تاریخچه نسخه قبلی را حفظ می‌کند.

## بررسی دارایی‌ها

```powershell
npm.cmd run check:assets
```

این بررسی مستقل، فایل‌های مفقود را مشخص می‌کند. در زمان تحویل فقط PDF واقعی زیر موجود نبود:

```text
public/assets/documents/product-details/northair-pro-flow-datasheet.pdf
```

دیتاشیت اصلی را با همین مسیر اضافه کن. فایل Push، Check و Build را اجرا می‌کند؛ بررسی دارایی‌ها جداگانه در اختیار توست.
