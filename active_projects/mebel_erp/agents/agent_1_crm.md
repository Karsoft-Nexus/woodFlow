# 🤖 AI Coding Agent 1: CRM, Lead Pipeline & Scheduling Planner

Sen **WoodFlow ERP** loyihasi uchun Frontend dasturiy ta'minotining CRM, mijozlar bilan muloqot zanjiri (Leads), o'lchovlar (Zamer) boshqaruvi, 3D model dizayni yuklash va Kichik TZ (Order Scheduling) modullarini yozishga mas'ul bo'lgan **AI Agent 1**san.

---

## 🛠️ Texnik Texnologiyalar
* **Framework:** React.js (TypeScript) + Vite
* **Dizayn Tizimi:** Tailwind CSS + Shadcn UI + Lucide React (ikonkalar)
* **State Management:** Zustand (global holatlar uchun)
* **API Client:** Axios (interceptor'lar va JWT bilan sozlangan bazaviy sozlamalar yordamida)
* **Dizayn Estetikasi:** Premium Dark Mode (Foni: `Slate-950` (#090d16), Asosiy aksent rangi: `Emerald-500` (#10b981) - sex unumdorligini anglatuvchi yashil rang, Card/Surface: `Slate-900` (#0f172a)).

---

## 📂 Siz Yaratadigan Fayllar va Tuzilish
Quyidagi fayllarni mos ravishda yaratishingiz yoki tahrirlashingiz lozim:
1. `src/pages/orders/OrdersList.tsx` - Buyurtma va lidlarning umumiy ro'yxati (Kanbanga o'tish bilan).
2. `src/pages/orders/OrderCreate.tsx` - Yangi lid/buyurtma yaratish shakli.
3. `src/pages/orders/OrderDetail.tsx` - Buyurtma tafsilotlari, jumladan:
   * O'lchovchini biriktirish dialogi.
   * O'lchov natijalarini (planshetdagi kabi) kiritish va eskiz/rasm yuklash.
   * 3D chizma yuklash va tasdiqlash oynasi.
4. `src/pages/orders/OrderScheduling.tsx` - Kichik TZ (Gantt/Timeline kunbay rejalashtiruvchi) shakli.
5. `src/pages/orders/OrderContract.tsx` - O'zbekiston qonunchiligiga mos shartnoma generatori va print oynasi.

---

## 📋 Batafsil Vazifalar va UI/UX Talablari

### 1. Lid/Buyurtma Yaratish (OrderCreate.tsx)
* Yangi kelgan mijozni tizimga qo'shish formasi.
* **Maydonlar:** Mijoz ismi, Telefon raqami, Mijoz kelgan manbasi (`Telegram`, `Instagram`, `Telefon`, `Ofisga keldi`).
* Ma'lumotlar saqlangach, order statusi `YANGI_LID` bo'ladi.

### 2. O'lchovchi (Zamerchik) Biriktirish va O'lchovlar Entry (OrderDetail.tsx ichida)
* **Zamer biriktirish formasi:** Mavjud usta/zamerchiklar ro'yxatidan o'lchovchini tanlash va uchrashuv sanasi/vaqtini belgilash (`assigned_zamerchik_id`, `zamer_scheduled_at`).
* **Zamer natijalarini yuklash formasi:**
  * Xona o'lchamlari: Uzunligi, Kengligi, Balandligi (metrda).
  * Devor materiallari toifasi (`Gisht`, `Beton`, `Gipsokarton`), burchaklar (90 gradus burchak tekshiruvi), gaz/suv quvurlari va rozetkalar joylashuvi bo'yicha belgilash katakchalari.
  * Eskiz rasmini yoki o'lchov chizmasini yuklash maydoni (`zamer_sketch_url`).

### 3. 3D Model Dizayni va Tasdiqlash
* 3D model dizayneri tomonidan tayyorlangan loyihaning 3D chizmasini yuklash (`design_3d_url`).
* Mijozga ko'rsatilganidan so'ng, "Dizayn Mijozga Yoqdi" tasdiqlash (Approval) tugmasi. Bosilganda order statusi `DIZAYN_TASDIQLANDI` bo'ladi.

### 4. Kichik TZ va Kunbay Reja Planner (OrderScheduling.tsx)
* Buyurtma ishlab chiqarishga o'tishidan oldin menejer loyiha bosqichlarini rejalashtirishi kerak.
* **UI talabi:** 5 ta ishlab chiqarish bosqichini (`Raskroy`, `Kromka`, `Pristadka`, `Sborka`, `Ustanovka`) toggle yordamida yoqish/o'chirish imkoniyati.
* Har bir bosqich uchun rejalashtirilgan boshlanish sanasi (`planned_start_at`) va tugash sanasi (`planned_end_at`) kiritiladi.
* Umumiy boshlanish va tugash sanalarini hisoblab beruvchi visual timeline (kunbay jadval).

### 5. O'zbekiston Qonunchiligi Doirasida Shartnoma Generatori (OrderContract.tsx)
* **Ma'lumotlar:** Mijoz pasport ma'lumotlari, JShShIR, shartnoma umumiy summasi, kafolat muddati, dedlayn (Planner asosida avtomatik olinadi) va to'lanadigan avans miqdori (`advance_payment`).
* **Print Layout (Chop etish):** 
  * `@media print` CSS stilini yozing.
  * Printerdan chop etish tugmasi bosilganda sidebar, header, tugmalar yashirinib, faqat toza shartnoma matni va imzolar bloki oq qog'oz (A4 format) ko'rinishida chiqishi shart.
  * Avans to'langach, shartnoma imzolangan hisoblanadi va buyurtma avtomatik `PRODUCTION` holatiga o'tadi.

---

## 📡 API Integratsiya Spec
Siz foydalanadigan endpointlar:
* `POST /api/v1/orders/` - Yangi lid/buyurtma yaratish.
* `POST /api/v1/orders/{id}/assign-zamer/` -> payload: `{ zamerchik_id, scheduled_at }`
* `POST /api/v1/orders/{id}/upload-zamer/` -> payload: `{ dimensions: { l, w, h, walls }, zamer_sketch_file }`
* `POST /api/v1/orders/{id}/upload-design/` -> payload: `{ design_file }`
* `POST /api/v1/orders/{id}/approve-design/` -> payload: `{ approved: true }`
* `POST /api/v1/orders/{id}/create-schedule/` -> payload: `{ stages: [ { stage_name, planned_start_at, planned_end_at } ] }`
* `POST /api/v1/orders/{id}/sign-contract/` -> payload: `{ passport_series, passport_number, pinfl, advance_amount, payment_method }`

---

## 🚀 Kod yozishdan oldin BAJARILISHI SHART bo'lgan birinchi qadam (TARTIB-INTIZOM QOIDALARI):
1. **Feedback o'qish:** Ishni boshlashdan oldin [NEO_FEEDBACK.md](file:///home/test/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/Karsoft%20Projects%28Neo%29/active_projects/mebel_erp/agents/NEO_FEEDBACK.md) faylini o'qing va u yerda siz uchun yozilgan maxsus topshiriqlar yoki ogohlantirishlar yo'qligiga ishonch hosil qiling.
2. **Subtasklarni ro'yxatdan o'tkazish:** Kod yozishni boshlashdan oldin quyidagi buyruqni terminalda ishga tushiring:
   ```bash
   node scripts/register_subtasks.js agent1
   ```
3. **Doskani yangilash:** Ishni boshlaganingizda Kanban doskangizdagi vazifani **"Bajarilmoqda" (In Progress)** holatiga o'tkazing. Ishni yakunlagach, uni **"Bajarildi" (Done)** holatiga o'tkazing.
4. **Qat'iy Cheklov (PR Block):** Agar topshiriq doskada "Bajarildi" (Done) deb belgilanmagan bo'lsa, siz yozgan kodlar Neo (Tech Lead) tomonidan rad etiladi (PR reject qilinadi).

---

## 🚀 Copy-Paste qilish uchun Boshlang'ich Prompt:
> *"Sen WoodFlow ERP loyihasida CRM, Lead, Zamer, 3D Design, Scheduling va Contract generator modullarini yaratuvchi AI frontendsan. Loyiha poydevorini ko'rib chiqib, birinchi qadam sifatida `node scripts/register_subtasks.js agent1` buyrug'ini ishga tushirib, o'z subtasklaringni doskaga yukla. Ish boshlashdan oldin vazifalarni 'in_progress', tugatgach 'done' qilishni unutma. So'ngra React, Tailwind CSS va Shadcn UI dan foydalanib, `src/pages/orders/` va `src/components/orders/` papkalarida interfeyslarni yarat. Premium qora dizayn va Emerald-500 aksent rangidan foydalan. Shartnoma sahifasida `@media print` layout yozib, printerdan chop etish uchun chiroyli oq qog'oz A4 formatini shakllantir. `/api/v1/orders/` API endpointlari bilan axios orqali to'liq bog'lanish logikasini yoz."*
