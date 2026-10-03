# راهنمای تغییر اندازه‌های فونت و هیرو

برای تغییر سایزها، فایل `src/css/type-settings.css` را باز کنید. بالای فایل مقادیر مشترک همه صفحات قرار دارد و بخش `PAGE OVERRIDES` برای تغییر اختصاصی هر صفحه است. این فایل از `src/css/responsive.css` وارد می‌شود و قواعد نمایش هیرو در `src/css/components/hero.css` از همین متغیرها استفاده می‌کنند.

## اندازه‌های پیش‌فرض

| بخش | دسکتاپ، از ۱۱۸۰ پیکسل | تبلت، ۶۴۰ تا ۱۱۷۹ پیکسل | موبایل، تا ۶۳۹ پیکسل |
| --- | --- | --- | --- |
| عنوان اول / مسیر صفحه | 28px | 20px | 20px |
| عنوان اصلی | 42px | 38px | 25px |
| متن توضیحی هیرو | 42px | 38px | 22px |
| حداقل ارتفاع هیرو | 31rem | 31rem | 25svh |
| متن معمولی و توضیحات کارت‌های مشترک | 16px | 16px | 15px |
| عنوان کارت‌های مشترک | 18px | 17px | 16px |
| عنوان بخش‌های مشترک | 28px | 26px | 22px |

فونت کنترل‌های فرم `16px` و منوی ناوبری `14px` است. صفحات محصولات، صنایع، تهویه و جزئیات محصول پاراگراف توضیحی هیرو ندارند؛ برای آن‌ها متن جدیدی اضافه نشده است.

ارتفاع‌ها **حداقل** هستند. طبق انتخاب شما، مقدار موبایل حداقل `25svh` است. برای حفظ خوانایی متن‌های بلند با فونت‌های درخواستی، دسکتاپ و تبلت نیز از `31rem` به‌عنوان ارتفاع پایه استفاده می‌کنند. هرجا متن بلند، فرم جست‌وجو یا کارت‌های تماس جا نشوند، هیرو به اندازه محتوایش بزرگ می‌شود. متن بریده نمی‌شود و اسکرول داخلی ندارد.

## تغییر مشترک همه صفحات

مقادیر دارای پسوند `-desktop`، `-tablet` و `-mobile` ورودی‌های قابل ویرایش هستند. مثلاً برای تغییر عنوان اصلی همه صفحات، این سه خط را در بالای فایل تغییر دهید:

```css
--hero-title-desktop: 42px;
--hero-title-tablet: 38px;
--hero-title-mobile: 25px;
```

بخش انتهای فایل فقط انتخاب مقدار مناسب هر عرض صفحه را انجام می‌دهد؛ برای تغییر معمول سایزها، آن بخش را ویرایش نکنید.

## تغییر مخصوص یک صفحه

در بخش `PAGE OVERRIDES`، پیش از قواعد انتخاب اندازه در انتهای فایل، برای صفحه موردنظر مقدار اختصاصی بنویسید. مثال زیر فقط عنوان دسکتاپ صفحه پروژه‌ها را تغییر می‌دهد:

```css
body[data-page="projects"] {
    --hero-title-desktop: 44px;
    --hero-title-tablet: 38px;
    --hero-title-mobile: 25px;
    --hero-height-desktop: 31rem;
}
```

برای صفحه‌ای که از قبل در این بخش تنظیم دارد، مقدار جدید را داخل همان بلوک اضافه کنید. مثلاً در بلوک `about` می‌توانید فونت متن توضیحی را اضافه کنید و تنظیم فاصله پایین و عکس تیم را نگه دارید:

```css
body[data-page="about"] {
    --hero-bottom: 64px;
    --hero-summary-desktop: 36px;
    --hero-summary-tablet: 36px;
    --hero-summary-mobile: 24px;
    --hero-description-desktop: 42px;
    --hero-description-tablet: 38px;
    --hero-description-mobile: 22px;
}
```

| فایل صفحه | مقدار `data-page` |
| --- | --- |
| `index.html` | `home` |
| `projects.html` | `projects` |
| `project-details.html` | `project-details` |
| `products.html` | `products` |
| `product-details.html` | `product-details` |
| `industries.html` | `industries` |
| `industry-textile.html` | `industry-textile` |
| `air-handling.html` | `air-handling` |
| `expertise.html` | `expertise` |
| `articles.html` | `articles` |
| `about.html` | `about` |
| `contact.html` | `contact` |

## فاصله‌ها و فونت بخش‌های دیگر

- `--hero-top-desktop/tablet/mobile`: فاصله بالای محتوای هیرو؛ باید برای لوگو و هدر جا بگذارد.
- `--hero-bottom`: فاصله پایین محتوای هیرو.
- `--hero-eyebrow-leading`، `--hero-title-leading` و `--hero-description-leading`: نسبت فاصله بین خطوط.
- `--text-body-desktop/tablet/mobile`: متن‌های معمولی مشترک.
- `--text-card-desktop/tablet/mobile`: عنوان کارت‌های مشترک.
- `--text-section-desktop/tablet/mobile`: عنوان بخش‌های مشترک.
- `--text-control` و `--text-navigation`: کنترل‌های فرم و منوی ناوبری.
- `--hero-summary-desktop/tablet/mobile`: میزان هم‌پوشانی ترجیحی عکس یا کارت بعد از هیرو در درباره ما، جزئیات پروژه، جزئیات محصول و صنعت نساجی.

ماژول `src/js/components/hero.js` میزان هم‌پوشانی را با فضای خالی زیر آخرین خط هیرو تطبیق می‌دهد و حداقل ۲۴ پیکسل فاصله با متن نگه می‌دارد. بنابراین تغییر فونت یا شکستن خطوط، عکس یا کارت را روی متن نمی‌اندازد. مقدار محاسبه‌شده `--hero-summary-overlap` را مستقیم ویرایش نکنید.

## ساختار هیرو و هدر

ریشه هیرو `data-site-hero` و کلاس `site-hero` دارد. محتوا، عنوان اول، عنوان اصلی و توضیح با کلاس‌های `site-hero__content`، `site-hero__eyebrow`، `site-hero__title` و `site-hero__description` مشخص شده‌اند. سایزهای عددی قبلی Tailwind از همین عناصر حذف شده‌اند تا چند قانون هم‌زمان فونت را تغییر ندهند.

هدر مشترک مستقیماً زیر `body` قرار دارد تا دراپ‌داون‌ها بالای سایر بخش‌ها نمایش داده شوند. پترن هدر همچنان داخل ریشه هیرو قرار می‌گیرد؛ include هدر را دوباره داخل هیرو منتقل نکنید.

پس از تغییر اندازه‌ها، صفحه موردنظر را در عرض‌های ۳۹۰، ۹۰۰ و ۱۴۴۰ پیکسل ببینید و این دو دستور را اجرا کنید:

```bash
npm run check
npm run build:pages
```
