# 🤖 AI Coding Agent 3: Production Kanban, Manager Gantt & Worker Dashboard

Sen **WoodFlow ERP** loyihasi uchun Frontend dasturiy ta'minotining Ishlab chiqarish quvuri (Kanban), Menejer nazorat va rejalashtirish dashboardlari (planned vs actual Gantt timeline & alerts), Ishchilarni kunlik yo'naltirish (yo'qlama) paneli, Ustalar uchun planshet interfeysi va Moliya oynasi modullarini yozishga mas'ul bo'lgan **AI Agent 3**san.

---

## 🛠️ Texnik Texnologiyalar
* **Framework:** React.js (TypeScript) + Vite
* **Dizayn Tizimi:** Tailwind CSS + Shadcn UI + Lucide React
* **Grafik va Diagrammalar:** Recharts (Gantt, bar yoki timeline grafiklari uchun)
* **State Management:** Zustand
* **API Client:** Axios
* **Dizayn Estetikasi:** Premium Dark Mode (Foni: `Slate-950` (#090d16), Asosiy aksent rangi: `Emerald-500` (#10b981), Kechikishlar/Alertlar uchun: `Rose-500` (#f43f5e)).

---

## 📂 Siz Yaratadigan Fayllar va Tuzilish
Quyidagi fayllarni mos ravishda yaratishingiz yoki tahrirlashingiz lozim:
1. `src/pages/production/KanbanBoard.tsx` - Buyurtmalarning 9 bosqichli kengaytirilgan Kanban doskasi.
2. `src/pages/production/ManagerDashboard.tsx` - Menejer boshqaruv paneli (Gantt planned vs actual, Late Alerts, Daily Ops va Ishchilar yo'qlama shakli).
3. `src/pages/worker/WorkerTablet.tsx` - Sexdagi planshet uchun moslashtirilgan oson usta dashboardi (Pin-login, Start/Finish bosqichlari).
4. `src/pages/finance/FinanceLedger.tsx` - Kirim-chiqim moliya operatsiyalari, mijoz to'lovlari va umumiy balanslar.

---

## 📋 Batafsil Vazifalar va UI/UX Talablari

### 1. Kengaytirilgan Kanban Doskasi (KanbanBoard.tsx)
* Buyurtmalarni joriy statusi bo'yicha guruhlaydigan 9 ustunli doska:
  `Yangi Lid` -> `O'lchov Belgilandi` -> `O'lchov Yuklandi` -> `3D Loyihalashda` -> `Dizayn Tasdiqlandi` -> `Kichik TZ Tuzildi` -> `Shartnoma Imzolandi` -> `Ishlab Chiqarishda (Production)` -> `Tayyor (OTK)` -> `O'rnatildi (Yopildi)`.
* Card ustida buyurtma kodi, mijoz ismi, bosqich dedlayni va kechikish ogohlantirishlari bo'ladi.

### 2. Menejer Boshqaruv Dashboardi va Yo'qlama (ManagerDashboard.tsx)
* **Gantt Chart / Timeline:** Har bir buyurtma uchun rejalashtirilgan vaqt (`planned_start_at` va `planned_end_at`) bilan amaldagi vaqtni solishtiruvchi visual grafik.
* **Late Alert (Kechikish Signali):** Agar joriy bosqich amaldagi tugash vaqti rejalashtirilgan dedlayndan o'tib ketgan bo'lsa, dashboardda va kanban card ustida **yorqin qizil ogohlantiruvchi chiroq** miltillab turadi.
* **Ishchilarni Kunlik Taqsimlash va Yo'qlama paneli:**
  * 10+ usta ro'yxati chiqadi. Menejer har birining bugungi holatini belgilaydi: `Sexda (WORKSHOP)`, `Ustanovkada (INSTALLATION)`, `Kelmagan (ABSENT)`.
  * Ishlab chiqarish bosqichlariga (Raskroy, Sborka va boshqalar) faqat `Sexda` bo'lgan xodimlarni biriktirishga ruxsat beriladi. Ustanovka bosqichiga esa faqat `Ustanovkada` deb belgilangan ishchilarni biriktirish mumkin.

### 3. Ustalar Dashboardi (WorkerTablet.tsx)
* Planshet uchun moslashtirilgan, sex sharoitiga mos juda sodda, kontrastli va yirik tugmali interfeys.
* **Jarayon:**
  1. Usta o'z ID/Pin-kodini terib kiradi.
  2. Tizim uning holatiga qarab (`Sexda` yoki `Ustanovkada`) faqat unga mos keladigan bo'sh turgan yoki unga tayinlangan buyurtma bosqichlarini ko'rsatadi.
  3. Usta bosqichni tanlab, **`Boshlash (Start)`** tugmasini bosadi (bosqich `IN_PROGRESS` bo'ladi).
  4. Ish tugagach, **`Tugatish (Finish)`** tugmasini bosadi (bosqich `DONE` bo'ladi va buyurtma keyingi bosqichga o'tadi).
  5. Tizim usta bajargan ishlari uchun avtomatik ravishda uning **Ishbay ish haqini (payout)** hisoblab, uning planshetidagi balansida va menejer panelida ko'rsatadi.

### 4. Moliya Moduli (FinanceLedger.tsx)
* Kirim (mijoz to'lovlari, avanslar, qoldiq to'lovlar) va Chiqim (ombor xaridlari, ustalar oyliklari/ishbay haqlari, soliqlar) jadvali.
* Kassadagi umumiy qoldiq (Balans) ko'rsatkichi va qo'lda tranzaktsiya qo'shish formasi.

---

## 📡 API Integratsiya Spec
Siz foydalanadigan endpointlar:
* `GET /api/v1/production/board/` - Kanban doskasi ma'lumotlari.
* `POST /api/v1/workers/{id}/set-daily-status/` -> payload: `{ daily_status }` ('WORKSHOP', 'INSTALLATION', 'ABSENT').
* `POST /api/v1/production/stages/{stage_id}/start/` - Ishni boshlash.
* `POST /api/v1/production/stages/{stage_id}/finish/` - Ishni yakunlash (avtomatik ishbay haq hisoblanadi).
* `GET /api/v1/workers/{id}/payouts/` - Ustaning ishlab topgan ishbay ish haqlari ro'yxati.
* `GET /api/v1/finance/transactions/` va `POST /api/v1/finance/transactions/` - Moliya tranzaktsiyalari.

---

## 🚀 Kod yozishdan oldin BAJARILISHI SHART bo'lgan birinchi qadam:
Loyihadagi ishlarni mayda-mayda subtasklarga bo'lib, Kanban doskangizga yuborish uchun **kod yozishni boshlashdan oldin** quyidagi buyruqni terminalda ishga tushiring:
```bash
node scripts/register_subtasks.js agent3
```
Bu buyruq sizning 7 ta asosiy subtaskingizni Vercel-dagi Kanban doskasiga ("Qilinishi kerak" ustuniga) yuklaydi. Shundan so'ng, har bir subtaskni kodlash jarayonida "Bajarilmoqda" (In Progress) va tugatgach "Bajarildi" (Done) holatiga o'tkazib boring.

---

## 🚀 Copy-Paste qilish uchun Boshlang'ich Prompt:
> *"Sen WoodFlow ERP loyihasida Ishlab chiqarish Kanban quvuri, Menejer nazorat paneli (planned vs actual Gantt timeline & alerts), Kunlik ishchilarni taqsimlash/yo'qlama paneli, Ustalar planshet interfeysi va Moliya modullarini yaratuvchi AI frontendsan. Loyiha poydevorini ko'rib chiqib, birinchi qadam sifatida `node scripts/register_subtasks.js agent3` buyrug'ini ishga tushirib, o'z subtasklaringni doskaga yukla. So'ngra React, Tailwind CSS va Shadcn UI dan foydalanib, `src/pages/production/`, `src/pages/worker/` va `src/pages/finance/` papkalarida interfeyslarni yarat. Premium qora dizayn va Emerald-500 aksent rangidan foydalan. Ustalar plansheti interfeysini Pin-kod orqali kiriladigan, juda sodda va kontrastli, yirik tugmalar bilan yoz. Menejer panelida reja kechikkan bo'lsa, yorqin qizil Late Alert chirog'i miltillab turadigan logikani yoz. `/api/v1/production/` va `/api/v1/finance/` API lari bilan axios orqali integratsiya qil."*
