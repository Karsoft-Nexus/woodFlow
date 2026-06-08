const fs = require('fs');
const path = require('path');

const localesPath = path.join('e:', 'karsoft', 'mebel', 'src', 'locales');
const kkPath = path.join(localesPath, 'kk.json');
const ruPath = path.join(localesPath, 'ru.json');

const kk = JSON.parse(fs.readFileSync(kkPath, 'utf-8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8'));

const kkFinance = {
  "title": "Касса ҳәм Молия",
  "subtitle": "Жергиликли молиявий кирим-шығыс журналы, баланс ҳәм шығынлар анализи",
  "btn_new_tx": "Таза Транзакция",
  "loading": "Мағлыўматлар жүкленбекте...",
  "balance_label": "Касса Қалдығы (Баланс)",
  "income_label": "Жәми Кирим",
  "expense_label": "Жәми Шығым",
  "currency": "UZS",
  "table_title": "Транзакциялар Тарийхы",
  "col_type": "Түри",
  "col_category_note": "Категория / Изоҳ",
  "col_payment_type": "Төлеў Түри",
  "col_date": "Сән",
  "col_amount": "Жәми",
  "no_transactions": "Транзакциялар табылмады.",
  "type_income": "Кирим",
  "type_expense": "Шығым",
  "cat_client_payment": "Буйыртмашы төлеўи",
  "cat_inventory_purchase": "Склад сатып алыў",
  "cat_worker_payout": "Уста жумыс ҳақы",
  "cat_tax": "Салық",
  "cat_other": "Басқа шығын",
  "form_title": "Таза Транзакция Қосыў",
  "form_type": "Түри",
  "btn_income": "КИРИМ",
  "btn_expense": "ШЫҒЫМ",
  "form_category": "Категория",
  "opt_client_payment": "Буйыртмашы төлеўи",
  "opt_other_income": "Басқа кирим",
  "opt_inventory_purchase": "Склад сатып алыў",
  "opt_worker_payout": "Уста жумыс ҳақы",
  "opt_tax": "Салықлар",
  "opt_other_expense": "Басқа шығынлар",
  "form_payment_method": "Төлеў Усылы",
  "opt_cash": "Нақ пул",
  "opt_card": "Карта",
  "opt_bank": "Банк аударымы",
  "form_order": "Буйыртпа (ихтыярый)",
  "opt_select_order": "Буйыртпаны таңлаў...",
  "form_amount": "Сомасы (UZS)",
  "form_amount_placeholder": "Масалан: 5000000",
  "form_description": "Тәрийп",
  "form_description_placeholder": "Транзакция мәлиматларын жазың...",
  "btn_save": "Сақлаў"
};

const ruFinance = {
  "title": "Касса и Финансы",
  "subtitle": "Журнал локальных финансовых операций, баланс и анализ расходов",
  "btn_new_tx": "Новая Транзакция",
  "loading": "Загрузка данных...",
  "balance_label": "Остаток в Кассе (Баланс)",
  "income_label": "Всего Доходов",
  "expense_label": "Всего Расходов",
  "currency": "UZS",
  "table_title": "История Транзакций",
  "col_type": "Тип",
  "col_category_note": "Категория / Комментарий",
  "col_payment_type": "Способ Оплаты",
  "col_date": "Дата",
  "col_amount": "Сумма",
  "no_transactions": "Транзакции не найдены.",
  "type_income": "Приход",
  "type_expense": "Расход",
  "cat_client_payment": "Оплата клиента",
  "cat_inventory_purchase": "Закупка на склад",
  "cat_worker_payout": "Зарплата мастеров",
  "cat_tax": "Налог",
  "cat_other": "Прочие расходы",
  "form_title": "Добавить Новую Транзакцию",
  "form_type": "Тип",
  "btn_income": "ПРИХОД",
  "btn_expense": "РАСХОД",
  "form_category": "Категория",
  "opt_client_payment": "Оплата клиента",
  "opt_other_income": "Прочие поступления",
  "opt_inventory_purchase": "Закупка на склад",
  "opt_worker_payout": "Зарплата мастеров",
  "opt_tax": "Налоги",
  "opt_other_expense": "Прочие расходы",
  "form_payment_method": "Способ Оплаты",
  "opt_cash": "Наличные",
  "opt_card": "Карта",
  "opt_bank": "Банковский перевод",
  "form_order": "Заказ (необязательно)",
  "opt_select_order": "Выбрать заказ...",
  "form_amount": "Сумма (UZS)",
  "form_amount_placeholder": "Например: 5000000",
  "form_description": "Описание",
  "form_description_placeholder": "Опишите детали транзакции...",
  "btn_save": "Сохранить"
};

kk.finance = kkFinance;
ru.finance = ruFinance;

fs.writeFileSync(kkPath, JSON.stringify(kk, null, 2), 'utf-8');
fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf-8');
console.log('Locales updated for Finance.');

// Component Update
const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'finance', 'FinanceLedger.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

if (!content.includes("useTranslation")) {
  content = content.replace(
    "import { useStore } from '../../store/useStore';",
    "import { useStore } from '../../store/useStore';\nimport { useTranslation } from 'react-i18next';"
  );
  content = content.replace(
    "export const FinanceLedger: React.FC = () => {",
    "export const FinanceLedger: React.FC = () => {\n  const { t } = useTranslation();"
  );
}

// Replace getCategoryLabel function
const oldCatFn = `  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'CLIENT_PAYMENT': return 'Mijoz to\\'lovi';
      case 'INVENTORY_PURCHASE': return 'Ombor xaridi';
      case 'WORKER_PAYOUT': return 'Ustalar ish haqi';
      case 'TAX': return 'Soliq';
      default: return 'Boshqa xarajat';
    }
  };`;

const newCatFn = `  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'CLIENT_PAYMENT': return t('finance.cat_client_payment');
      case 'INVENTORY_PURCHASE': return t('finance.cat_inventory_purchase');
      case 'WORKER_PAYOUT': return t('finance.cat_worker_payout');
      case 'TAX': return t('finance.cat_tax');
      default: return t('finance.cat_other');
    }
  };`;

content = content.replace(oldCatFn, newCatFn);

const rep = {
  "Kassa va Moliya": "{t('finance.title')}",
  "Lokal moliyaviy kirim-chiqimlar jurnali, balans va xarajatlar tahlili": "{t('finance.subtitle')}",
  "Yangi Tranzaksiya</span>": "{t('finance.btn_new_tx')}</span>",
  "Ma'lumotlar yuklanmoqda...": "{t('finance.loading')}",
  "Kassa Qoldig'i (Balans)": "{t('finance.balance_label')}",
  "Jami Kirimlar": "{t('finance.income_label')}",
  "Jami Chiqimlar": "{t('finance.expense_label')}",
  "Tranzaksiyalar Tarixi": "{t('finance.table_title')}",
  ">Turi<": ">{t('finance.col_type')}<",
  ">Kategoriya / Izoh<": ">{t('finance.col_category_note')}<",
  ">To'lov Turi<": ">{t('finance.col_payment_type')}<",
  ">Sana<": ">{t('finance.col_date')}<",
  ">Summa<": ">{t('finance.col_amount')}<",
  "Tranzaksiyalar topilmadi.": "{t('finance.no_transactions')}",
  "'Kirim' : 'Chiqim'": "t('finance.type_income') : t('finance.type_expense')",
  "Yangi Tranzaksiya Qo'shish": "{t('finance.form_title')}",
  ">Turi<": ">{t('finance.form_type')}<",
  "KIRIM (Income)": "{t('finance.btn_income')}",
  "CHIQIM (Expense)": "{t('finance.btn_expense')}",
  ">Kategoriya<": ">{t('finance.form_category')}<",
  "Mijoz to'lovi (Client Payment)": "{t('finance.opt_client_payment')}",
  "Boshqa kirimlar": "{t('finance.opt_other_income')}",
  "Ombor xaridi (Inventory Purchase)": "{t('finance.opt_inventory_purchase')}",
  "Ustalar ish haqi (Salary)": "{t('finance.opt_worker_payout')}",
  "Soliqlar (Taxes)": "{t('finance.opt_tax')}",
  "Boshqa xarajatlar": "{t('finance.opt_other_expense')}",
  ">To'lov Usuli<": ">{t('finance.form_payment_method')}<",
  "Naqd (CASH)": "{t('finance.opt_cash')}",
  "Karta (CARD)": "{t('finance.opt_card')}",
  "Hisob-raqam (BANK TRANSFER)": "{t('finance.opt_bank')}",
  "Buyurtma (ixtiyoriy)": "{t('finance.form_order')}",
  "Buyurtmani tanlash...": "{t('finance.opt_select_order')}",
  "Summa (UZS)": "{t('finance.form_amount')}",
  "\"Masalan: 5000000\"": "{t('finance.form_amount_placeholder')}",
  "Tavsif (Description)": "{t('finance.form_description')}",
  "\"Tranzaksiya tafsilotlarini yozing...\"": "{t('finance.form_description_placeholder')}",
  ">Saqlash<": ">{t('finance.btn_save')}<"
};

for (const [key, val] of Object.entries(rep)) {
  content = content.split(key).join(val);
}

// Fix placeholder attributes specially
content = content.replace(
  'placeholder="Masalan: 5000000"',
  'placeholder={t(\'finance.form_amount_placeholder\')}'
);
content = content.replace(
  'placeholder="Tranzaksiya tafsilotlarini yozing..."',
  'placeholder={t(\'finance.form_description_placeholder\')}'
);

fs.writeFileSync(componentPath, content, 'utf-8');
console.log('Component updated for Finance.');
