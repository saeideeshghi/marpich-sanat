# انتشار V3 در GitHub

نسخهٔ package برابر `3.0.0` و tag انتشار `v3` است. GitHub Pages از branch `main` ساخته می‌شود؛ کدهای این نسخه را در همان branch قرار بده.

## روش آماده برای ویندوز

۱. محتویات `marpich-sanat-v3.zip` را کنار `package.json` در clone فعلی Merge/Replace کن. پوشه‌های تصاویر و فونت‌های موجود را نگه دار.

۲. فایل `PUSH-GITHUB.cmd` را اجرا کن. اسکریپت فایل‌های منسوخ را حذف می‌کند، تغییرات را با پیام V3 commit می‌کند، تغییرات remote را با rebase می‌گیرد، Check و Build را انجام می‌دهد و سپس `main` و tag `v3` را در یک Push می‌فرستد.

۳. نتیجهٔ Deploy را در [GitHub Actions](https://github.com/saeideeshghi/marpich-sanat/actions) بررسی کن. بعد از موفقیت، [سایت](https://saeideeshghi.github.io/marpich-sanat/) به‌روزرسانی می‌شود.

اسکریپت فقط با اجرای خودت انتشار را انجام می‌دهد. tag موجود جابه‌جا نمی‌شود و force push ندارد.

## اجرای دستی در CMD

در پوشهٔ پروژه اجرا کن. اگر tag `v3` از قبل وجود دارد، برای انتشار بعدی نام دیگری انتخاب کن.

```cmd
git switch main
git ls-remote --tags origin refs/tags/v3
npm run clean:legacy -- --apply
git status
git add -A
git commit -m "Release V3 - clean frontend and advanced customizer"
git pull --rebase origin main
npm ci
npm run check
npm run build:pages
git tag -a v3 -m "Marpich Sanat V3"
git push --atomic origin main refs/tags/v3
```

اگر هر دستور خطا داد، همان خطا را برطرف کن و بعد ادامه بده. اگر commit می‌گوید تغییری وجود ندارد، از مرحلهٔ pull ادامه بده. اگر rebase conflict داشت، فایل‌ها را اصلاح و `git rebase --continue` را اجرا کن.

اگر Push اسکریپت به دلیل اتصال یا احراز هویت متوقف شد و tag محلی ساخته شده بود، پس از رفع مشکل فقط Push همان commit و tag را تکرار کن:

```cmd
git push --atomic origin main refs/tags/v3
```

## نمایش V3 در بخش Releases

بعد از Push موفق، در GitHub به **Releases → Draft a new release** برو؛ tag موجود `v3` را انتخاب کن، عنوان را `Marpich Sanat V3` بگذار و **Publish release** را بزن. انتشار سایت با Push روی `main` انجام می‌شود و ساخت Release برای نمایش و دانلود نسخه است.

## آپلود با صفحهٔ GitHub

در branch `main` از **Add file → Upload files** استفاده کن. سورس‌ها و فایل‌های workflow را با ساختار کامل آپلود و پیام commit را `Release V3` بگذار. فایل ZIP، `node_modules`، `dist` و cache را به‌عنوان سورس سایت آپلود نکن. بعد از commit، از **Releases → Draft a new release**، tag جدید `v3` را روی `main` بساز و منتشر کن.

مرورگر فایل‌های قدیمی را هنگام Merge حذف نمی‌کند؛ مسیرهای `docs/obsolete-files.json` را نیز از مخزن حذف کن. روش اسکریپت این پاک‌سازی را خودش انجام می‌دهد.
