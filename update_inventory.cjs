const fs = require('fs');
const path = require('path');

const localesPath = path.join('e:', 'karsoft', 'mebel', 'src', 'locales');
const kkPath = path.join(localesPath, 'kk.json');
const ruPath = path.join(localesPath, 'ru.json');

const kk = JSON.parse(fs.readFileSync(kkPath, 'utf-8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8'));

const kkInventory = {
  "title": "Склад ҳәм Шийки зат Басқарыўы",
  "subtitle": "Материалларды бәнт етиў (брон), кирим/шығыс есабы ҳәм буйыртпа BOM (рецепт) редакциясы.",
  "tab_stock": "Склад Қалдықлары",
  "tab_transactions": "Кирим-Шығыс Тарийхы",
  "tab_bom": "BOM (Рецепт) Редакторы",
  "total_stock": "Складтағы Жәми Материаллар",
  "reserved_stock": "Резервке (Брон) Алынған",
  "low_stock": "Таўсылып атырған Өнимлер",
  "count_items": "та",
  "count_types": "та түрде",
  "search_placeholder": "Материал атын излеў...",
  "all_categories": "Барлық Категориялар",
  "low_stock_only": "Тек таўсылып атырған товарлар",
  "add_transaction": "Кирим / Шығыс Қылыў",
  "col_name_category": "Аты ҳәм Категориясы",
  "col_current_stock": "Ҳәзирги Қалдық",
  "col_reserved": "Резерв (Брон)",
  "col_available": "Бар (Мәжүд)",
  "col_average_price": "Орташа Таннарқы",
  "col_status": "Статус",
  "status_low": "Таўсылмақта!",
  "status_enough": "Жетерли",
  "tx_log_title": "Барлық Склад Әмеллери Логи",
  "add_new_tx": "Таза Әмелият Қосыў",
  "col_date_time": "Сәне / Ўақыт",
  "col_product_name": "Өним Аты",
  "col_operation": "Әмелият",
  "col_quantity": "Муғдары",
  "col_unit_price": "Баҳасы (Бирлик)",
  "col_notes": "Коментарийлер / Толықлаўлар",
  "unknown_product": "Намәлим өним",
  "tx_in": "КИРИМ",
  "tx_out": "ШЫҒЫС",
  "active_orders": "Актив Буйыртпалар",
  "order_status": "Статус:",
  "order_info": "Буйыртпа Мағлыўматы",
  "order_type": "Түри:",
  "total_bom_cost": "Шийки зат Жәми Таннарқы",
  "add_to_bom": "Материал / Шийки зат Рецептке Қосыў",
  "select_material": "Материал Түрин Таңлаң",
  "available": "бар",
  "bom_qty": "Муғдары",
  "add_to_bom_btn": "BOMға Қосыў",
  "col_required_qty": "Керекли Муғдар",
  "col_bom_reserved": "Брон Қылынған",
  "col_bom_unit_price": "Бирлик Баҳасы",
  "col_bom_total_price": "Жәми Баҳасы",
  "col_delete": "Өшириў",
  "no_bom_items": "Материаллар рецептке бириктирилмеген. Жоқарыдан қосыўыңыз мүмкин.",
  "unknown": "Намәлим",
  "no_order_selected": "Киши ТТ / Жойбарлаў басқышындағы буйыртпа таңланбаған.",
  "modal_tx_title": "Складқа Кирим / Шығыс Әмелияты",
  "modal_material": "Материал / Товар",
  "modal_tx_type": "Әмелият Түри",
  "tx_in_desc": "Кирим (Кассадан материалға)",
  "tx_out_desc": "Шығыс (Цехқа шығыў)",
  "modal_qty_hint": "Муғдары (Қалдық болса бөлшек киритиң)",
  "modal_unit_price": "Бирлик Баҳасы (UZS)",
  "modal_notes_hint": "Коментарий (Жеткезип бериўши / Себеби)",
  "modal_notes_placeholder": "Масалан: MebelAlimPlas ЖШЖдан жеткезилди",
  "cancel": "Бийкар етиў",
  "submit": "Әмелге асырыў",
  "cat_plates": "Плита материаллар (ДСП/МДФ)",
  "cat_stolishnitsa": "Столешницалар",
  "cat_edges": "Мебель лентасы (Кромка)",
  "cat_furnitures": "Фурнитуралар (Петля, Шруп)",
  "cat_accessories": "Аксессуарлар (Ручка, Поршень)",
  "cat_weight_items": "Аўырлық шийки затлар (Желим, кг)",
  "cat_glass": "Айна ҳәм Шийшалар"
};
kkInventory.cancel = "Бийкар етиў";

const ruInventory = {
  "title": "Управление Складом и Сырьем",
  "subtitle": "Бронирование материалов, учет прихода/расхода и редактирование спецификации (BOM) заказов.",
  "tab_stock": "Остатки на складе",
  "tab_transactions": "История Прихода-Расхода",
  "tab_bom": "Редактор BOM (Рецепт)",
  "total_stock": "Всего материалов на складе",
  "reserved_stock": "В резерве (Бронь)",
  "low_stock": "Заканчивающиеся товары",
  "count_items": "шт",
  "count_types": "видов",
  "search_placeholder": "Поиск по названию материала...",
  "all_categories": "Все Категории",
  "low_stock_only": "Только заканчивающиеся товары",
  "add_transaction": "Приход / Расход",
  "col_name_category": "Название и Категория",
  "col_current_stock": "Текущий Остаток",
  "col_reserved": "Резерв (Бронь)",
  "col_available": "В наличии (Доступно)",
  "col_average_price": "Средняя Себестоимость",
  "col_status": "Статус",
  "status_low": "Заканчивается!",
  "status_enough": "Достаточно",
  "tx_log_title": "Журнал всех складских операций",
  "add_new_tx": "Добавить Новую Операцию",
  "col_date_time": "Дата / Время",
  "col_product_name": "Название Товара",
  "col_operation": "Операция",
  "col_quantity": "Количество",
  "col_unit_price": "Цена (За единицу)",
  "col_notes": "Комментарии / Детали",
  "unknown_product": "Неизвестный товар",
  "tx_in": "ПРИХОД",
  "tx_out": "РАСХОД",
  "active_orders": "Активные Заказы",
  "order_status": "Статус:",
  "order_info": "Информация о Заказе",
  "order_type": "Тип:",
  "total_bom_cost": "Общая Стоимость Сырья",
  "add_to_bom": "Добавить Материал/Сырье в Рецепт",
  "select_material": "Выберите Тип Материала",
  "available": "в наличии",
  "bom_qty": "Количество",
  "add_to_bom_btn": "Добавить в BOM",
  "col_required_qty": "Требуемое Кол-во",
  "col_bom_reserved": "Забронировано",
  "col_bom_unit_price": "Цена за Единицу",
  "col_bom_total_price": "Общая Стоимость",
  "col_delete": "Удалить",
  "no_bom_items": "Материалы не прикреплены к рецепту. Вы можете добавить их выше.",
  "unknown": "Неизвестно",
  "no_order_selected": "Заказ на этапе Мини-ТЗ / Проектирования не выбран.",
  "modal_tx_title": "Операция Прихода / Расхода на Склад",
  "modal_material": "Материал / Товар",
  "modal_tx_type": "Тип Операции",
  "tx_in_desc": "Приход (Из кассы в материал)",
  "tx_out_desc": "Расход (Выдача в цех)",
  "modal_qty_hint": "Количество (Дробное, если остаток)",
  "modal_unit_price": "Цена за Единицу (UZS)",
  "modal_notes_hint": "Комментарий (Поставщик / Причина)",
  "modal_notes_placeholder": "Например: Доставлено от ООО MebelAlimPlas",
  "cancel": "Отмена",
  "submit": "Выполнить",
  "cat_plates": "Плиточные материалы (ДСП/МДФ)",
  "cat_stolishnitsa": "Столешницы",
  "cat_edges": "Кромочная лента",
  "cat_furnitures": "Фурнитура (Петли, Шурупы)",
  "cat_accessories": "Аксессуары (Ручки, Поршни)",
  "cat_weight_items": "Весовое сырье (Клей, кг)",
  "cat_glass": "Стекло и Зеркала"
};

kk.inventory = kkInventory;
ru.inventory = ruInventory;

fs.writeFileSync(kkPath, JSON.stringify(kk, null, 2), 'utf-8');
fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf-8');

console.log('Locales updated.');

// Now update InventoryBOM.tsx
const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'inventory', 'InventoryBOM.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

// Ensure useTranslation is imported and used
if (!content.includes('useTranslation')) {
  content = content.replace(
    "import { useStore } from '../../store/useStore';",
    "import { useStore } from '../../store/useStore';\nimport { useTranslation } from 'react-i18next';"
  );
}

if (!content.includes('const { t } = useTranslation();')) {
  content = content.replace(
    "export const InventoryBOM: React.FC = () => {",
    "export const InventoryBOM: React.FC = () => {\n  const { t } = useTranslation();"
  );
}

// Replace exact strings
const rep = {
  ">Omborxona va Xomashyo Boshqaruvi<": ">{t('inventory.title')}<",
  ">Materiallar bron qilish, kirim/chiqim hisobi va buyurtma BOM (retsept) tahriri.<": ">{t('inventory.subtitle')}<",
  ">Ombor Qoldiqlari<": ">{t('inventory.tab_stock')}<",
  ">Kirim-Chiqim Tarixi<": ">{t('inventory.tab_transactions')}<",
  ">BOM (Retsept) Muharriri<": ">{t('inventory.tab_bom')}<",
  ">Ombordagi Jami Materiallar<": ">{t('inventory.total_stock')}<",
  ">Zaxiraga (Bron) Olingan<": ">{t('inventory.reserved_stock')}<",
  ">Tugayotgan Mahsulotlar<": ">{t('inventory.low_stock')}<",
  "{totalStockItems} ta": "{totalStockItems} {t('inventory.count_items')}",
  "{totalReservedItems} ta": "{totalReservedItems} {t('inventory.count_items')}",
  "{lowStockItems.length} ta turda": "{lowStockItems.length} {t('inventory.count_types')}",
  "placeholder=\"Material nomini qidirish...\"": "placeholder={t('inventory.search_placeholder')}",
  ">Barcha Toifalar<": ">{t('inventory.all_categories')}<",
  ">Faqat tugayotgan tovarlar<": ">{t('inventory.low_stock_only')}<",
  "> Kirim / Chiqim Qilish<": "> {t('inventory.add_transaction')}<",
  ">Nomi & Toifasi<": ">{t('inventory.col_name_category')}<",
  ">Joriy Qoldiq<": ">{t('inventory.col_current_stock')}<",
  ">Rezerv (Bron)<": ">{t('inventory.col_reserved')}<",
  ">Mavjud (Available)<": ">{t('inventory.col_available')}<",
  ">O'rtacha Tannarxi<": ">{t('inventory.col_average_price')}<",
  ">Status<": ">{t('inventory.col_status')}<",
  ">Tugamoqda!<": ">{t('inventory.status_low')}<",
  ">Yetarli<": ">{t('inventory.status_enough')}<",
  ">Barcha Ombor Amallari Logi<": ">{t('inventory.tx_log_title')}<",
  ">Yangi Amaliyot Qo'shish<": ">{t('inventory.add_new_tx')}<",
  ">Sana / Vaqt<": ">{t('inventory.col_date_time')}<",
  ">Mahsulot Nomi<": ">{t('inventory.col_product_name')}<",
  ">Amaliyot<": ">{t('inventory.col_operation')}<",
  ">Miqdori<": ">{t('inventory.col_quantity')}<",
  ">Narxi (Birlik)<": ">{t('inventory.col_unit_price')}<",
  ">Izohlar / Tafsilotlar<": ">{t('inventory.col_notes')}<",
  "|| 'Noma\\'lum mahsulot'": "|| t('inventory.unknown_product')",
  "isKirim ? 'KIRIM' : 'CHIQIM'": "isKirim ? t('inventory.tx_in') : t('inventory.tx_out')",
  ">Faol Buyurtmalar<": ">{t('inventory.active_orders')}<",
  ">Status:<": ">{t('inventory.order_status')}<",
  ">Buyurtma Ma'lumoti<": ">{t('inventory.order_info')}<",
  ">Turi: ": ">{t('inventory.order_type')} ",
  "• Status: ": "• {t('inventory.order_status')} ",
  ">Xomashyo Jami Tannarxi<": ">{t('inventory.total_bom_cost')}<",
  ">Material / Xomashyo Retseptga Qo'shish<": ">{t('inventory.add_to_bom')}<",
  ">Material Turini Tanlang<": ">{t('inventory.select_material')}<",
  " mavjud)": " {t('inventory.available')})",
  ">Miqdori<": ">{t('inventory.bom_qty')}<",
  "> BOMga Qo'shish<": "> {t('inventory.add_to_bom_btn')}<",
  ">Kerakli Miqdor<": ">{t('inventory.col_required_qty')}<",
  ">Bron Qilingan<": ">{t('inventory.col_bom_reserved')}<",
  ">Birlik Narx<": ">{t('inventory.col_bom_unit_price')}<",
  ">Jami Narx<": ">{t('inventory.col_bom_total_price')}<",
  ">O'chirish<": ">{t('inventory.col_delete')}<",
  "Materiallar retseptga biriktirilmagan. Yuqoridan qo'shishingiz mumkin.": "{t('inventory.no_bom_items')}",
  "|| 'Noma\\'lum'": "|| t('inventory.unknown')",
  "Kichik TZ / Loyihalash bosqichidagi buyurtma tanlanmagan.": "{t('inventory.no_order_selected')}",
  ">Omborga Kirim / Chiqim Amaliyoti<": ">{t('inventory.modal_tx_title')}<",
  ">Material / Tovar<": ">{t('inventory.modal_material')}<",
  ">Amaliyot Turi<": ">{t('inventory.modal_tx_type')}<",
  ">Kirim (Kassadan materialga)<": ">{t('inventory.tx_in_desc')}<",
  ">Chiqim (Sexga chiqish)<": ">{t('inventory.tx_out_desc')}<",
  ">Miqdori (Qoldiq bo'lsa kasr kiriting)<": ">{t('inventory.modal_qty_hint')}<",
  ">Birlik Narxi (UZS)<": ">{t('inventory.modal_unit_price')}<",
  ">Izoh (Yetkazib beruvchi / Sababi)<": ">{t('inventory.modal_notes_hint')}<",
  "placeholder=\"Masalan: MebelAlimPlas MChJdan yetkazildi\"": "placeholder={t('inventory.modal_notes_placeholder')}",
  ">Bekor qilish<": ">{t('inventory.cancel')}<",
  ">Amalga oshirish<": ">{t('inventory.submit')}<",
  "Plitalar (DSP/MDF)": "{t('inventory.cat_plates')}",
  ">Stolishnitsalar<": ">{t('inventory.cat_stolishnitsa')}<",
  ">Kromka<": ">{t('inventory.cat_edges')}<",
  ">Furnituralar (Petlya, Shrup)<": ">{t('inventory.cat_furnitures')}<",
  ">Aksessuarlar (Rushka, Porshun)<": ">{t('inventory.cat_accessories')}<",
  ">Og'irlik xomashyolar (Yelim, kg)<": ">{t('inventory.cat_weight_items')}<",
  ">Oyna va Shishalar<": ">{t('inventory.cat_glass')}<"
};

for (const [key, val] of Object.entries(rep)) {
  content = content.split(key).join(val);
}

// Special case for getCategoryLabel
const catLabelOriginal = `
  // Get Category Uzbek label
  const getCategoryLabel = (category: ProductCategory) => {
    switch (category) {
      case 'PLATES': return 'Plita materiallar (DSP/MDF)';
      case 'STOLISHNITSA': return 'Stolishnitsalar';
      case 'EDGES': return 'Mebel lentasi (Kromka)';
      case 'FURNITURES': return 'Furnituralar (Petlya, Shrup)';
      case 'ACCESSORIES': return 'Aksessuarlar (Rushka, Porshun)';
      case 'WEIGHT_ITEMS': return 'Og\\'irlik xomashyolar (Yelim, kg)';
      case 'GLASS': return 'Oyna va Shishalar';
      default: return category;
    }
  };`;
const catLabelNew = `
  // Get Category Uzbek label
  const getCategoryLabel = (category: ProductCategory) => {
    switch (category) {
      case 'PLATES': return t('inventory.cat_plates');
      case 'STOLISHNITSA': return t('inventory.cat_stolishnitsa');
      case 'EDGES': return t('inventory.cat_edges');
      case 'FURNITURES': return t('inventory.cat_furnitures');
      case 'ACCESSORIES': return t('inventory.cat_accessories');
      case 'WEIGHT_ITEMS': return t('inventory.cat_weight_items');
      case 'GLASS': return t('inventory.cat_glass');
      default: return category;
    }
  };`;
content = content.replace(catLabelOriginal, catLabelNew);

fs.writeFileSync(componentPath, content, 'utf-8');
console.log('Component updated.');
