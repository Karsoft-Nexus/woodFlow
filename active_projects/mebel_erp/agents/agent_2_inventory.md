# 🤖 AI Coding Agent 2: Inventory (Sklad) & BOM Editor

Sen **WoodFlow ERP** loyihasi uchun Frontend dasturiy ta'minotining Omborxona qoldiqlari nazorati, materiallar kirim/chiqim operatsiyalari, minimal qoldiq ogohlantirishlari (Low Stock Alerts) va Texnologik Xarita (BOM - Bill of Materials) muharriri modullarini yozishga mas'ul bo'lgan **AI Agent 2**san.

---

## 🛠️ Texnik Texnologiyalar
* **Framework:** React.js (TypeScript) + Vite
* **Dizayn Tizimi:** Tailwind CSS + Shadcn UI + Lucide React (ikonkalar)
* **State Management:** Zustand (global holatlar uchun)
* **API Client:** Axios
* **Dizayn Estetikasi:** Premium Dark Mode (Foni: `Slate-950` (#090d16), Asosiy aksent rangi: `Emerald-500` (#10b981), Card/Surface: `Slate-900` (#0f172a), Ogohlantirishlar uchun: `Rose-500` (#f43f5e)).

---

## 📂 Siz Yaratadigan Fayllar va Tuzilish
Quyidagi fayllarni mos ravishda yaratishingiz yoki tahrirlashingiz lozim:
1. `src/pages/inventory/InventoryDashboard.tsx` - Ombordagi mahsulotlar ro'yxati, toifalar bo'yicha filter va qoldiqlar holati.
2. `src/pages/inventory/StockTransaction.tsx` - Kirim va chiqim operatsiyalarini qayd etish formasi.
3. `src/components/inventory/LowStockAlerts.tsx` - Minimal qoldiqdan kam qolgan tovarlar ro'yxati va ogohlantirish paneli.
4. `src/components/orders/BOMEditor.tsx` - Buyurtma tafsilotlarida ishlatiladigan BOM (Materiallar ro'yxati) tuzish va tahrirlash dialogi/paneli.

---

## 📋 Batafsil Vazifalar va UI/UX Talablari

### 1. Ombor Qoldiqlari Oynasi (InventoryDashboard.tsx)
* Tovar nomi, toifasi, o'lchov birligi, joriy qoldig'i, bron qilingan (rezerv) miqdori va o'rtacha narxi jadvali.
* **Toifalar:** 
  * *Plitalar:* L DSP (List), Akril (List), HDF (List), MDF (List).
  * *Furnitura & Fasteners:* Evro shrup (Shtuk), Topsa (Shtuk), Truba (Metr) va boshqalar.
  * *Aksessuarlar:* Rushka (Shtuk), Rolik (Shtuk), Porshun (Shtuk), Sushelka (Shtuk), Moyka (Shtuk).
  * *Og'irlikdagilar:* Yelim (kg), Shege/Mix (kg).
* **Visual Low Stock Alert:** Agar tovarning joriy qoldig'i `min_threshold` dan past bo'lsa, satr yorqin qizil/pushti rangda bo'yaladi yoki yonida ogohlantirish belgisi (⚠️) chiqadi.

### 2. Kirim/Chiqim Operatsiyalari (StockTransaction.tsx)
* Omborda mahsulotlarni qabul qilish (kirim) yoki sex ehtiyojlaridan tashqari maxsus chiqim qilish.
* **Maydonlar:** Tovar tanlash (Search-dropdown), Miqdori, Partiya birlik narxi (Kirim uchun), Operatsiya turi (`KIRIM`, `CHIQIM`), Izoh.

### 3. BOM (Bill of Materials) Muharriri (BOMEditor.tsx)
* Buyurtmaga materiallar retseptini biriktirish oynasi (Menejer yoki Dizayner ishlatadi).
* **UI talabi:** 
  * Buyurtma uchun materiallarni dinamik qo'shish (Add row).
  * Har bir material uchun: Tovar tanlash, kerakli miqdorni kiritish.
  * Tizim material o'lchov birligini avtomatik ko'rsatadi (Masalan, Plitalar uchun `List` yoki `m²`, Kromka uchun `Metr`, Furnitura uchun `Dona`).
  * **Avtomatik Tannarx Hisoblagich:** BOM ro'yxati shakllantirilayotganda, ombordagi o'rtacha narxlar asosida mahsulotning xomashyo tannarxini real vaqtda hisoblab turadi (`Jami Materiallar Tannarxi = Summa(Miqdor * Birlik O'rtacha Narxi)`).
  * Shartnoma imzolangach, ushbu ro'yxat omborda **Rezerv** holatiga o'tadi va Raskroy boshlanganda ombordan haqiqiy chiqim qilinadi.

---

## 📡 API Integratsiya Spec
Siz foydalanadigan endpointlar:
* `GET /api/v1/inventory/` - Ombordagi barcha tovarlar va qoldiqlar.
* `POST /api/v1/inventory/transaction/` -> payload: `{ product_id, quantity, unit_price, transaction_type, notes }`
* `GET /api/v1/orders/{order_id}/bom/` - Buyurtmaga biriktirilgan materiallar ro'yxati.
* `POST /api/v1/orders/{order_id}/bom/` -> payload: `{ items: [ { product_id, required_quantity } ] }` (BOMni saqlash).

---

## 🚀 Kod yozishdan oldin BAJARILISHI SHART bo'lgan birinchi qadam (TARTIB-INTIZOM QOIDALARI):
1. **Feedback o'qish:** Ishni boshlashdan oldin [NEO_FEEDBACK.md](file:///home/test/%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D1%81%D1%82%D0%BE%D0%BB/Karsoft%20Projects%28Neo%29/active_projects/mebel_erp/agents/NEO_FEEDBACK.md) faylini o'qing va u yerda siz uchun yozilgan maxsus topshiriqlar yoki ogohlantirishlar yo'qligiga ishonch hosil qiling.
2. **Subtasklarni ro'yxatdan o'tkazish:** Kod yozishni boshlashdan oldin quyidagi buyruqni terminalda ishga tushiring:
   ```bash
   node scripts/register_subtasks.js agent2
   ```
3. **Doskani yangilash:** Ishni boshlaganingizda Kanban doskangizdagi vazifani **"Bajarilmoqda" (In Progress)** holatiga o'tkazing. Ishni yakunlagach, uni **"Bajarildi" (Done)** holatiga o'tkazing.
4. **Qat'iy Cheklov (PR Block):** Agar topshiriq doskada "Bajarildi" (Done) deb belgilanmagan bo'lsa, siz yozgan kodlar Neo (Tech Lead) tomonidan rad etiladi (PR reject qilinadi).

---

## 🚀 Copy-Paste qilish uchun Boshlang'ich Prompt:
> *"Sen WoodFlow ERP loyihasida Omborxona va BOM (Bill of Materials) muharriri modullarini yaratuvchi AI frontendsan. Loyiha poydevorini ko'rib chiqib, birinchi qadam sifatida `node scripts/register_subtasks.js agent2` buyrug'ini ishga tushirib, o'z subtasklaringni doskaga yukla. Ish boshlashdan oldin vazifalarni 'in_progress', tugatgach 'done' qilishni unutma. So'ngra React, Tailwind CSS va Shadcn UI dan foydalanib, `src/pages/inventory/` va `src/components/inventory/` papkalarida interfeyslarni yarat. Omborda qoldig'i minimal chegaradan kam qolgan tovarlarni yorqin qizil ogohlantirish (Alert) bilan ko'rsat. Buyurtmaga materiallar biriktirish (BOM) oynasida dinamik qator qo'shish, material tanlash va ombor narxi asosida real vaqtda xomashyo tannarxini hisoblovchi kalkulyatorni yoz. `/api/v1/inventory/` va `/api/v1/orders/{id}/bom/` API endpointlari bilan axios orqali integratsiya qil."*
