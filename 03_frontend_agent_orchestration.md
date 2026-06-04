# 🤖 WoodFlow ERP: Frontend Lead va AI Agentlarni Boshqarish Qo'llanmasi
> **Frontend Lead:** Azizbek  
> **Ishchi stantsiyalar:** Ofisdagi 3 ta kompyuter va ularda ishlovchi 3 ta AI Frontend Agentlari.

Ushbu qo'llanma React.js frontendini qanday qilib tezkor va tartibli ishlab chiqish, jamoaviy git-oqimi (git workflow) va AI agentlarini qanday boshqarishni belgilab beradi.

---

## 1. Azizbek (Frontend Lead) - Boshlang'ich Sozlash va Roli
Azizbek loyihaning umumiy poydevorini (boilerplate) yaratadi va AI agentlar yozgan kodlarni birlashtiradi.

### 1.1. Loyihani Ishga Tushirish (Setup)
Azizbek birinchi bo'lib React loyihasini **Vite** va **TypeScript** yordamida yaratadi:
```bash
npm create vite@latest woodflow-frontend -- --template react-ts
cd woodflow-frontend
npm install
```

### 1.2. Kerakli Kutubxonalar (Dependencies)
Quyidagi kutubxonalar o'rnatilishi lozim:
* **UI Komponentlar:** Tailwind CSS, Shadcn UI (`npx shadcn-ui@latest init`), Lucide React (ikonkalar uchun).
* **State Management & Routing:** Zustand (`npm install zustand`), React Router DOM (`npm install react-router-dom`).
* **API Bog'lanish:** Axios (`npm install axios`).
* **Grafiklar:** Recharts (`npm install recharts`).

### 1.3. Global Stil va Dark Mode (Visual Design)
Tizim qora, premium va kontrastli fonda bo'ladi. `index.css` faylida quyidagi ranglar palitrasi o'rnatiladi:
* Background: `Slate-950` (#090d16)
* Primary Accent: `Emerald-500` (#10b981) - Ishlab chiqarish unumdorligi uchun.
* Text: `Slate-100` va `Slate-400`
* Card/Surface: `Slate-900` (#0f172a) va bordyorlar uchun `Slate-800`.

### 1.4. Umumiy TypeScript tiplari (Shared Types)
Loyihada ma'lumotlar tuzilishi bir xil bo'lishi uchun Azizbek loyiha boshida [typescript_types.md](file:///home/test/Рабочий стол/Karsoft Projects(Neo)/active_projects/mebel_erp/agents/typescript_types.md) faylidagi interfeyslarni `src/types/index.ts` fayliga saqlab qo'yishi shart. Barcha agentlar shu fayldan tiplarni import qilib ishlatadi.

### 1.5. Kodni Birlashtirish (Code Review & Merge)
* Har bir AI agent alohida git-branchda ishlaydi: `feature/crm-orders`, `feature/inventory-bom`, `feature/production-finance`.
* Azizbek har bir agent bajargan ishni ko'rib chiqadi, UI mosligi (consistency), mobile-friendly ekanligi va API integratsiyasini tekshirib, `main` branchga birlashtiradi.

---

## 2. 3 ta AI Frontend Agentlari uchun Aniq Topshiriqlar

Azizbek ofisdagi 3 ta kompyuterda ishlayotgan AI agentlarga quyidagi batafsil topshiriq va tayyor prompt fayllarini taqdim etishi kerak:
* **AI Agent 1 (CRM & Contract):** [agent_1_crm.md](file:///home/test/Рабочий стол/Karsoft Projects(Neo)/active_projects/mebel_erp/agents/agent_1_crm.md)
* **AI Agent 2 (Inventory & BOM):** [agent_2_inventory.md](file:///home/test/Рабочий стол/Karsoft Projects(Neo)/active_projects/mebel_erp/agents/agent_2_inventory.md)
* **AI Agent 3 (Kanban & Tablet):** [agent_3_production.md](file:///home/test/Рабочий стол/Karsoft Projects(Neo)/active_projects/mebel_erp/agents/agent_3_production.md)

---

### 💻 AI AGENT 1 (Kompyuter 1): Lidxonlik, CRM va Shartnoma Moduli
* **Git Branch:** `feature/crm-orders`
* **Vazifalari:**
  1. **Lid Yaratish Formasi:** Telefon, Telegram, Instagram, Ofis manbalarini tanlash (select option), mijoz ismi va telefon raqami bilan yangi lid kiritish.
  2. **Zamer (O'lchov) Biriktirish Oynasi:** Ofis foydalanuvchisi uchun o'lchovchi (zamerchik) ni tanlash va uchrashuv sanasini belgilash shakli.
  3. **O'lchov Natijalarini Yuklash Formasi:** O'lchovchi foydalanuvchi sifatida o'lchamlarni va olingan rasmlarni/eskizlarni yuklash interfeysi.
  4. **3D Dizayn Moduli:** 3D mutaxassisi loyihani yuklashi (`design_3d_url` chizmalari yoki fayllari) va uni mijozga ko'rsatib tasdiqlatish (tasdiqlash tugmasi).
  5. **Kichik TZ va Rejalashtirish Shakli:** Loyihaning umumiy boshlanish/tugash vaqtini belgilash, kerakli etaplarni faollashtirish va har bir etap uchun kunbay reja kiritish oynasi.
  6. **Shartnoma Generatori va Print Layout:**
     * Shartnoma ma'lumotlarini kiritish (umumiy narx, kafolat muddati, dedlayn - reja asosida avtomatik hisoblanadi).
     * Shartnomani chop etish uchun **oq fondagi chiroyli print layout** (CSS `@media print` bilan faqat shartnoma matni chiqishi uchun sidebar va header yashiriladi).
     * Avans (downpayment) miqdori va to'lov usulini kiritib shartnomani faollashtirish (imzolash).

> **Prompt Agent 1 uchun:**
> *"Sen WoodFlow ERP loyihasida Lidxonlik, CRM, Shartnoma generatori va Kichik TZ rejalashtirish modulini yaratuvchi AI frontendsan. React, Tailwind CSS va Shadcn UI dan foydalanib `src/pages/orders/` va `src/components/orders/` papkalarida interfeyslarni yarat. Tizimda `@media print` yordamida shartnomani printerdan to'g'ridan-to'g'ri chop etuvchi chiroyli oq qog'oz formatidagi interfeysni yoz. `/api/v1/orders/` endpointlari (assign-zamer, upload-zamer, upload-design, create-schedule, generate-contract, sign-contract) bilan axios orqali integratsiya qil."*

---

### 💻 AI AGENT 2 (Kompyuter 2): Omborxona va BOM (Materiallar Retsepti)
* **Git Branch:** `feature/inventory-bom`
* **Vazifalari:**
  1. **Ombor Qoldiqlari Oynasi:** Tovar nomi, toifasi (Laminat, MDF, Furnitura, Bo'yoq), o'lchov birligi, qoldiq miqdori va o'rtacha narxi. Material qoldig'i `min_threshold` dan kam qolganda Qizil rangda ogohlantirish (Alert) chiqarish.
  2. **Kirim/Chiqim Operatsiyalari Formasi:** Ombordan materiallarni qabul qilish (kirim) yoki sexga chiqim qilish.
  3. **BOM (Materiallar Retsepti) Muharriri:** Har bir buyurtma oynasida "Materiallarni biriktirish (BOM)" tugmasini bosganda ochiladigan oyna. Unda kerakli laminat miqdori (kv.m), kromka (metr) va furnituralarni (dona) tanlash va buyurtmaga bog'lash imkoniyati bo'lishi kerak.

> **Prompt Agent 2 uchun:**
> *"Sen WoodFlow ERP loyihasida Omborxona va BOM (Bill of Materials) modulini yaratuvchi AI frontendsan. React, Tailwind CSS va Shadcn UI dan foydalanib, `src/pages/inventory/` va `src/components/inventory/` papkalarida interfeyslarni yarat. Ombordagi kam qolgan tovarlarni qizil rangda yoritib ko'rsatuvchi panellar yarat. `/api/v1/inventory/` va `/api/v1/orders/{id}/bom/` endpointlaridan foydalan."*

---

### 💻 AI AGENT 3 (Kompyuter 3): Ishlab Chiqarish (Kanban), Ustalar va Moliya paneli
* **Git Branch:** `feature/production-finance`
* **Vazifalari:**
  1. **Kengaytirilgan Kanban Doskasi:** Buyurtma statuslarini lid bosqichlaridan to ustanovkagacha kuzatish: `Yangi Lid` -> `O'lchov Belgilandi` -> `O'lchov Bajarildi` -> `3D Dizaynda` -> `Dizayn Tasdiqlandi` -> `Kichik TZ / Reja Tuzildi` -> `Shartnoma Imzolandi` -> `Ishlab chiqarishda (Production)` -> `Tayyor (OTK)` -> `O'rnatildi (Yopildi)`.
  2. **Menejer Boshqaruv va Nazorat Paneli:** Barcha buyurtmalarning rejalashtirilgan va amaldagi bajarilish ko'rsatkichlarini solishtiruvchi grafik (Gantt/Timeline chart), muddatdan kechikkan bosqichlar uchun visual qizil ogohlantiruvchi signal (Late Alert) tizimi, bugungi kunlik topshiriqlar ro'yxati (Daily Ops), hamda 10+ usta uchun kunlik statuslarni (Sexda, Ustanovkada, Kelmagan) belgilash va yo'qlama qilish interfeysi.
  3. **Ustalar Dashboardi (Planshet va Mobil uchun):** Ustalar planshetda ishlatishi uchun juda sodda, katta tugmalarga ega interfeys. Usta o'z ID/Pin-kodi bilan kiradi, unga tayinlangan yoki bo'sh turgan topshiriqni (Raskroy, Kromka, Pristadka, Sborka, Ustanovka) ko'radi, `Start` va `Finish` tugmalarini bosadi. Tizimda uning bugun bajargan ishlari va ishlab topgan ishbay ish haqi ko'rinadi.
  4. **Moliya Oynasi:** Kirim-chiqimlar jadvali, mijoz to'lovlari (avanslar, qoldiq to'lovlar), umumiy balans va tranzaktsiya qo'shish formasi.

> **Prompt Agent 3 uchun:**
> *"Sen WoodFlow ERP loyihasida Ishlab chiqarish quvuri (Kanban), Menejer nazorati dashboardi (Timeline planned vs actual, alerts va kunlik ishchilar taqsimoti/yo'qlamasi), Ustalar planshet paneli va Moliya modulini yaratuvchi AI frontendsan. React, Tailwind CSS va Shadcn UI dan foydalanib, `src/pages/production/`, `src/pages/worker/` va `src/pages/finance/` papkalarida interfeyslarni yarat. Menejer uchun reja, ogohlantirish indikatorlari va ishchilar yo'qlama panelini yorqin visual shaklda ko'rsat. Ustalar planshet interfeysini juda qulay va kontrastli qil. `/api/v1/production/` va `/api/v1/finance/` endpointlaridan foydalan."*

---

## 3. Kodni Birlashtirish Ketma-ketligi (Workflow)

```text
Qadam 1: Azizbek loyihani git init qilib, main va dev branchlarini yaratadi va GitHub-ga yuklaydi.
Qadam 2: Azizbek layout, router va Tailwind'ni sozlaydi.
Qadam 3: 3 ta kompyuterda AI agentlar o'z branchlarini (pull qilib) ochadi va kod yozishni boshlaydi.
Qadam 4: Agentlar ishni bitirgach, Pull Request (PR) ochishadi.
Qadam 5: Azizbek PR'larni ko'rib chiqadi (conflict'larni hal qiladi) va main branchga merge qiladi.
Qadam 6: Birlashgan loyiha test qilinadi va backend API ga ulanadi.
```
