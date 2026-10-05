# آپدیت V3 روی GitHub

نسخهٔ پروژه `3.0.0` است. سایت از branch `main` منتشر می‌شود. برای اصلاحات همین V3 نیازی به ساخت دوبارهٔ tag `v3` نیست.

## خطای بررسی متغیرها در ویندوز

اگر اجرا در Check متوقف می‌شود و اختلاف قرارداد متغیرها را نشان می‌دهد، پچ ویندوز را طبق [WINDOWS-PUSH-FIX.md](WINDOWS-PUSH-FIX.md) اعمال کن؛ سپس `npm run tokens:refresh` و `npm run publish:github` را اجرا کن. مسیرهای ویندوز، CSS ذخیره‌شده و هشدار جداگانهٔ `DEP0190` در ابزارهای این بسته اصلاح شده‌اند.

## خطای قبلی tag

پیام `Local tag v3 already exists` از helper قبلی می‌آمد: اسکریپت در هر بار اجرا تلاش می‌کرد همان tag را بسازد. helper این بسته به‌صورت پیش‌فرض فقط `main` را به‌روزرسانی می‌کند؛ tag قبلی را نگه می‌دارد.

1. محتویات پوشهٔ `marpich-sanat-v3` داخل ZIP را در ریشهٔ clone فعلی، کنار `package.json`، Merge/Replace کن؛ تصاویر، فونت‌ها و پوشه‌های اصلی پروژه را نگه دار.
2. در ویندوز `PUSH-GITHUB.cmd` را اجرا کن، یا در ترمینال پروژه دستور زیر را بزن:

```bash
npm run publish:github
```

helper مخزن مقصد را بررسی می‌کند، به `main` می‌رود، فایل‌های منسوخِ مشخص‌شده را پاک می‌کند، نصب وابستگی‌ها و Check/Build را انجام می‌دهد، تغییرات را commit می‌کند و پس از `pull --rebase`، `main` را Push می‌کند. اگر rebase کد را تغییر دهد، بررسی و ساخت دوباره انجام می‌شود. خطا اجرای مراحل بعدی را متوقف می‌کند؛ force push ندارد.

نتیجه را در [GitHub Actions](https://github.com/saeideeshghi/marpich-sanat/actions) بررسی کن. پس از Deploy موفق، [سایت](https://saeideeshghi.github.io/marpich-sanat/) به‌روز می‌شود. اجرای helper روی کامپیوترت، انتشار واقعی را انجام می‌دهد.

## اجرای دستی

دستورها را به ترتیب اجرا کن؛ اگر مرحله‌ای خطا داد، قبل از ادامه آن را برطرف کن.

```bash
git switch main
npm run clean:legacy -- --apply
npm ci
npm run check
npm run build:pages
git add -A
git commit -m "Update V3 - products, about image and pattern fixes"
git pull --rebase origin main
npm run check
npm run build:pages
git push origin main
```

اگر commit می‌گوید تغییری وجود ندارد، از مرحلهٔ pull ادامه بده. اگر rebase conflict داشت، موارد مشخص‌شده را حل و `git rebase --continue` را اجرا کن؛ سپس بررسی‌ها را دوباره انجام بده. اگر فایل‌های سورس هنگام Build تغییر کردند، آن‌ها را بررسی و commit کن.

## انتشار اختیاری با tag تازه

برای یک انتشار مجزا، ابتدا شمارهٔ نسخه را با `npm version 3.0.1 --no-git-tag-version` تغییر بده و سپس:

```bash
npm run publish:github -- --release-tag v3.0.1
```

این گزینه `main` و tag تازه را در یک Push اتمیک می‌فرستد. tag موجود فقط وقتی قابل تکرار است که روی همان commit باشد؛ tag مربوط به commit قبلی تغییر نمی‌کند. اگر Push به دلیل اتصال یا احراز هویت شکست خورد، پس از رفع علت **همان دستور و همان tag** را تکرار کن. انتشار معمولی V3 همچنان دستور بدون `--release-tag` است.

برای نمایش نسخه در Releases، در GitHub گزینهٔ **Draft a new release** را باز کن، tag تازه را انتخاب و عنوان نسخه را وارد کن. ساخت Release از آپدیت سایت روی `main` جداست.

## آپلود از صفحهٔ GitHub

در branch `main` از **Add file → Upload files** استفاده کن و سورس‌ها را با ساختار کامل جایگزین کن. ZIP، `node_modules`، `dist` و cache را به‌عنوان سورس آپلود نکن. فایل‌های منسوخ فهرست `docs/obsolete-files.json` را نیز حذف کن؛ آپلود مرورگر آن‌ها را خودکار پاک نمی‌کند. برای این آپدیت، tag `v3` را دوباره نساز.
