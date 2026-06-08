const fs = require('fs');
const path = require('path');

const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'finance', 'FinanceLedger.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

// 1. Add imports
if (!content.includes("useTranslation")) {
  content = content.replace(
    "import { useStore } from '../../store/useStore';",
    "import { useStore } from '../../store/useStore';\nimport { useTranslation } from 'react-i18next';"
  );
}

// 2. Add hook
if (!content.includes("const { t } = useTranslation();")) {
  content = content.replace(
    "export const FinanceLedger: React.FC = () => {",
    "export const FinanceLedger: React.FC = () => {\n  const { t } = useTranslation();"
  );
}

// 3. Fix getCategoryLabel
content = content.replace(
  "case 'CLIENT_PAYMENT': return 'Mijoz to\\'lovi';",
  "case 'CLIENT_PAYMENT': return t('finance.cat_client_payment');"
);
content = content.replace(
  "case 'INVENTORY_PURCHASE': return 'Ombor xaridi';",
  "case 'INVENTORY_PURCHASE': return t('finance.cat_inventory_purchase');"
);
content = content.replace(
  "case 'WORKER_PAYOUT': return 'Ustalar ish haqi';",
  "case 'WORKER_PAYOUT': return t('finance.cat_worker_payout');"
);
content = content.replace(
  "case 'TAX': return 'Soliq';",
  "case 'TAX': return t('finance.cat_tax');"
);
content = content.replace(
  "default: return 'Boshqa xarajat';",
  "default: return t('finance.cat_other');"
);

// 4. Header
content = content.replace("Kassa va Moliya", "{t('finance.title')}");
content = content.replace("Lokal moliyaviy kirim-chiqimlar jurnali, balans va xarajatlar tahlili", "{t('finance.subtitle')}");
content = content.replace(">Yangi Tranzaksiya<", ">{t('finance.btn_new_tx')}<");
content = content.replace("Ma'lumotlar yuklanmoqda...", "{t('finance.loading')}");

// 5. KPI Cards
content = content.replace("Kassa Qoldig'i (Balans)", "{t('finance.balance_label')}");
content = content.replace("Jami Kirimlar", "{t('finance.income_label')}");
content = content.replace("Jami Chiqimlar", "{t('finance.expense_label')}");

// 6. Table
content = content.replace("Tranzaksiyalar Tarixi", "{t('finance.table_title')}");
content = content.replace(">Turi<", ">{t('finance.col_type')}<");
content = content.replace(">Kategoriya / Izoh<", ">{t('finance.col_category_note')}<");
content = content.replace(">To'lov Turi<", ">{t('finance.col_payment_type')}<");
content = content.replace(">Sana<", ">{t('finance.col_date')}<");
content = content.replace(">Summa<", ">{t('finance.col_amount')}<");
content = content.replace("Tranzaksiyalar topilmadi.", "{t('finance.no_transactions')}");
content = content.replace("'Kirim' : 'Chiqim'", "t('finance.type_income') : t('finance.type_expense')");

// 7. Form
content = content.replace("Yangi Tranzaksiya Qo'shish", "{t('finance.form_title')}");
content = content.replace("KIRIM (Income)", "{t('finance.btn_income')}");
content = content.replace("CHIQIM (Expense)", "{t('finance.btn_expense')}");
content = content.replace("Mijoz to'lovi (Client Payment)", "{t('finance.opt_client_payment')}");
content = content.replace("Boshqa kirimlar", "{t('finance.opt_other_income')}");
content = content.replace("Ombor xaridi (Inventory Purchase)", "{t('finance.opt_inventory_purchase')}");
content = content.replace("Ustalar ish haqi (Salary)", "{t('finance.opt_worker_payout')}");
content = content.replace("Soliqlar (Taxes)", "{t('finance.opt_tax')}");
content = content.replace("Boshqa xarajatlar", "{t('finance.opt_other_expense')}");
content = content.replace("Naqd (CASH)", "{t('finance.opt_cash')}");
content = content.replace("Karta (CARD)", "{t('finance.opt_card')}");
content = content.replace("Hisob-raqam (BANK TRANSFER)", "{t('finance.opt_bank')}");
content = content.replace("Buyurtma (ixtiyoriy)", "{t('finance.form_order')}");
content = content.replace("Buyurtmani tanlash...", "{t('finance.opt_select_order')}");
content = content.replace("Summa (UZS)", "{t('finance.form_amount')}");
content = content.replace('placeholder="Masalan: 5000000"', "placeholder={t('finance.form_amount_placeholder')}");
content = content.replace("Tavsif (Description)", "{t('finance.form_description')}");
content = content.replace('placeholder="Tranzaksiya tafsilotlarini yozing..."', "placeholder={t('finance.form_description_placeholder')}");
content = content.replace(">Saqlash<", ">{t('finance.btn_save')}<");

// Fix label tags
content = content.replace(">Turi<", ">{t('finance.form_type')}<");
content = content.replace(">Kategoriya<", ">{t('finance.form_category')}<");
content = content.replace(">To'lov Usuli<", ">{t('finance.form_payment_method')}<");

fs.writeFileSync(componentPath, content, 'utf-8');
console.log('FinanceLedger.tsx fully translated.');
