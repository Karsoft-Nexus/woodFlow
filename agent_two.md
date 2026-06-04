# AI Agent 2: Omborxona & BOM (Inventory & Bill of Materials)

Ushbu hujjat D:\woodFlow\01_prd_technical_specification.md faylidan faqat Agent 2 ga tegishli bo'lgan vazifalar va qismlarni o'z ichiga oladi.

## Agent 2 Vazifasi
**Agent 2:** Omborxona, xomashyolar, materiallar hisobi va BOM (retseptlar) frontend qismini yozadi.

---

### 3.2. Mahsulot Retsepti va BOM (Bill of Materials)
* Har bir tasdiqlangan buyurtma uchun avtomatik yoki qo'lda **Texnologik Xarita (BOM)** shakllantiriladi.
* Tizimda ishlatiladigan xomashyolar quyidagi o'lchov birliklarida hisoblanadi:
  * **Plitalar (DSP/Laminat, Akril, HDF, MDF):** Butun plita (`List` - bo'yi x eni o'lchamlari bilan) ko'rinishida hisoblanadi. (Masalan: L DSP 2.50x1.83m = 4.6 m²; Akril 2.40x1.20m).
  * **Chiziqli materiallar (Kromka, Truba, Plentuz):** Metrda (`Metr`).
  * **O'lchovli va Dona tovarlar (Topsa/Petli, Rushka, Porshun, Noshka, Rolik, Zamok, Moyka, Sushelka, Push):** Donada (`Shtuk`).
  * **Og'irlikdagi xomashyolar (Yelim, Shrup, Shege/Mix):** Kilogrammda (`kg`).
  * **Oyna va Shishalar (Zerkla):** Kvadrat metrda (`m/kv`).
* **Avtomatik tannarx hisoblagich:** Tizim ombordagi joriy o'rtacha narxlarni olib, BOM ro'yxatidagi materiallar summasini jamlaydi va mahsulotning xomashyo tannarxini hisoblab beradi.

---

### 3.3. Omborxona va Xomashyo Nazorati (Warehouse)
* **Kategoriyalar va Ma'lumotlar Bazasi:** Tizim ombori `mebelalimplas.xlsx` ma'lumotlari asosida quyidagi toifalarga bo'linadi:
  * *Plitalar:* L DSP, Akril, HDF, MDF.
  * *Stolishnitsalar:* Stolishnitsa Rossiya (3m, 4m), Burchakli stolishnitsa, Stolishnitsa ugl stik.
  * *Kromkalar:* Kromka 19/0.4, 19/0.6, 19/1, 21/1, 35/1.
  * *Furnitura & Fasteners:* Topsa, Garbatiy/Pol garbatiy petlilar, Evro shrup, Shrup, Shege (mix), Flyans, Truba, Zamok, Ushkiy, Naklika, Dvaynoy skosh.
  * *Aksessuarlar:* Rushka (kishi, orta, ulken), Rolik, Porshun (gazlift), Veshelka, Noshka (klipsiy, nerjabika), Plentuz (ugl, zakrity0), Sushelka, Moyka, Gol rushka, Gol profil, Push.
* **Kirim va Partiyalar:** Har bir kirim operatsiyasida tovar miqdori va partiya narxi (FIFO/O'rtacha narx uchun) kiritiladi.
* **Materiallarni Bron Qilish (Reservation):** 
  * Shartnoma imzolangach, tizim BOM bo'yicha kerakli materiallarni avtomatik ravishda **Zaxira (Rezerv)** holatiga o'tkazadi. Rezervdagi materiallar jismonan omborda tursa ham, boshqa buyurtmalar uchun "Mavjud" (Available) deb ko'rsatilmaydi.
  * Sexda arra (Cutting/Raskroy) boshlanishi bilan rezervdagi materiallar ombordan haqiqiy **Chiqim (Deducted)** qilinadi.
* **Qoldiq Bo'laklar (Off-cuts) hisobi:** Arra jarayonida qolgan va ishlatishga yaroqli bo'lgan plita bo'laklari (masalan: 1.2m x 0.8m) usta tomonidan planshet orqali omborga "Qoldiq" sifatida kirim qilinadi va keyingi buyurtma BOMida birinchi navbatda ishlatish uchun tavsiya etiladi.
* **Minimal Qoldiq va Ogohlantirish (Alerts):** Har bir tovar uchun eng kam qoldiq chegarasi (`min_threshold`) o'rnatiladi. Qoldiq bu chegaradan tushsa, tizim administratorga "Omborda tovar tugamoqda" degan xabarnoma beradi.
