const fs = require('fs');
const path = require('path');

const localesPath = path.join('e:', 'karsoft', 'mebel', 'src', 'locales');
const kkPath = path.join(localesPath, 'kk.json');
const ruPath = path.join(localesPath, 'ru.json');

const kk = JSON.parse(fs.readFileSync(kkPath, 'utf-8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8'));

const kkSidebar = {
  "crm_orders": "CRM ҳәм Буйыртпалар",
  "inventory_bom": "Склад ҳәм BOM",
  "kanban_board": "Канбан Доскасы",
  "manager_dashboard": "Менеджер Панели",
  "worker_tablet": "Жумысшы Планшети",
  "finance_ledger": "Финанс Есабы"
};

const ruSidebar = {
  "crm_orders": "CRM и Заказы",
  "inventory_bom": "Склад и BOM",
  "kanban_board": "Канбан Доска",
  "manager_dashboard": "Панель Менеджера",
  "worker_tablet": "Планшет Рабочего",
  "finance_ledger": "Финансовая Книга"
};

kk.sidebar = kkSidebar;
ru.sidebar = ruSidebar;

fs.writeFileSync(kkPath, JSON.stringify(kk, null, 2), 'utf-8');
fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf-8');

console.log('Locales updated for Sidebar.');

// Now update Sidebar.tsx
const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'components', 'Sidebar.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

// Ensure useTranslation is imported and used
if (!content.includes('useTranslation')) {
  content = content.replace(
    "import { NavLink } from 'react-router-dom';",
    "import { NavLink } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';"
  );
}

if (!content.includes('const { t } = useTranslation();')) {
  content = content.replace(
    "export const Sidebar: React.FC = () => {",
    "export const Sidebar: React.FC = () => {\n  const { t } = useTranslation();"
  );
}

const rep = {
  "'CRM & Orders'": "t('sidebar.crm_orders')",
  "'Inventory & BOM'": "t('sidebar.inventory_bom')",
  "'Kanban Board'": "t('sidebar.kanban_board')",
  "'Manager Dashboard'": "t('sidebar.manager_dashboard')",
  "'Worker Tablet'": "t('sidebar.worker_tablet')",
  "'Finance Ledger'": "t('sidebar.finance_ledger')"
};

for (const [key, val] of Object.entries(rep)) {
  content = content.split(key).join(val);
}

fs.writeFileSync(componentPath, content, 'utf-8');
console.log('Component updated for Sidebar.');
