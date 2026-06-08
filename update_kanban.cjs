const fs = require('fs');
const path = require('path');

const localesPath = path.join('e:', 'karsoft', 'mebel', 'src', 'locales');
const kkPath = path.join(localesPath, 'kk.json');
const ruPath = path.join(localesPath, 'ru.json');

const kk = JSON.parse(fs.readFileSync(kkPath, 'utf-8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8'));

const kkKanban = {
  "col_yangi_lid": "Таза Лид",
  "col_zamer_belgilandi": "Өлшем Белгиленди",
  "col_zamer_bajarildi": "Өлшем Жүкленди",
  "col_dizayn_loyyahalashda": "3D Жойбарлаўда",
  "col_dizayn_tasdiqlandi": "Дизайн Тастыйықланды",
  "col_tz_tuzildi": "Киши ТТ Дүзилди",
  "col_shartnoma_imzolandi": "Шәртнама Қол қойылды",
  "col_production": "Ислеп Шығарыўда",
  "col_tayyor": "Тайын (ОТК)",
  "col_yopildi": "Орнатылды (Жабылды)",
  "title": "Ислеп Шығарыў Канбан Доскасы",
  "subtitle": "Буйыртпалар ҳәм лид воронкасы (CRM-нан жабылғанға шекемги барлық басқышлар)",
  "instruction_prefix": "Статусларды өткериў ушын карточкалардағы",
  "instruction_bold": "\"Кейинги\"",
  "instruction_suffix": "түймесин басың",
  "loading": "Мағлыўматлар жүкленбекте...",
  "no_orders": "Буйыртпалар жоқ",
  "current_stage": "Ҳәзирги басқышы:",
  "deadline": "Дедлайн:",
  "mln_uzs": "млн UZS",
  "next": "Кейинги",
  "closed": "Жабылды",
  "hours_late": "саат кешикти",
  "days_late": "күн кешикти",
  "in_progress": "(Орынланбақта)",
  "pending": "(Күтилмекте)",
  "no_stages": "Басқышлар жоқ"
};

const ruKanban = {
  "col_yangi_lid": "Новый Лид",
  "col_zamer_belgilandi": "Замер Назначен",
  "col_zamer_bajarildi": "Замер Загружен",
  "col_dizayn_loyyahalashda": "В 3D Проектировании",
  "col_dizayn_tasdiqlandi": "Дизайн Утвержден",
  "col_tz_tuzildi": "Мини-ТЗ Составлено",
  "col_shartnoma_imzolandi": "Договор Подписан",
  "col_production": "В Производстве",
  "col_tayyor": "Готово (ОТК)",
  "col_yopildi": "Установлено (Закрыто)",
  "title": "Канбан Доска Производства",
  "subtitle": "Воронка заказов и лидов (все этапы от CRM до закрытия)",
  "instruction_prefix": "Для перевода статуса нажмите кнопку",
  "instruction_bold": "\"Далее\"",
  "instruction_suffix": "на карточках",
  "loading": "Загрузка данных...",
  "no_orders": "Нет заказов",
  "current_stage": "Текущий этап:",
  "deadline": "Дедлайн:",
  "mln_uzs": "млн UZS",
  "next": "Далее",
  "closed": "Закрыто",
  "hours_late": "часов просрочки",
  "days_late": "дней просрочки",
  "in_progress": "(Выполняется)",
  "pending": "(В ожидании)",
  "no_stages": "Нет этапов"
};

kk.kanban = kkKanban;
ru.kanban = ruKanban;

fs.writeFileSync(kkPath, JSON.stringify(kk, null, 2), 'utf-8');
fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf-8');

console.log('Locales updated for Kanban.');

// Now update KanbanBoard.tsx
const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'production', 'KanbanBoard.tsx');
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
    "export const KanbanBoard: React.FC = () => {",
    "export const KanbanBoard: React.FC = () => {\n  const { t } = useTranslation();"
  );
}

const colsOld = `const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'YANGI_LID', label: 'Yangi Lid', color: 'border-t-blue-500 bg-blue-950/10' },
  { status: 'ZAMER_BELGILANDI', label: "O'lchov Belgilandi", color: 'border-t-indigo-500 bg-indigo-950/10' },
  { status: 'ZAMER_BAJARILDI', label: "O'lchov Yuklandi", color: 'border-t-violet-500 bg-violet-950/10' },
  { status: 'DIZAYN_LOYYAHALASHDA', label: '3D Loyihalashda', color: 'border-t-purple-500 bg-purple-950/10' },
  { status: 'DIZAYN_TASDIQLANDI', label: 'Dizayn Tasdiqlandi', color: 'border-t-pink-500 bg-pink-950/10' },
  { status: 'TZ_PLANNER_TUZILDI', label: 'Kichik TZ Tuzildi', color: 'border-t-cyan-500 bg-cyan-950/10' },
  { status: 'SHARTNOMA_IMZOLANDI', label: 'Shartnoma Imzolandi', color: 'border-t-teal-500 bg-teal-950/10' },
  { status: 'PRODUCTION', label: 'Ishlab Chiqarishda', color: 'border-t-emerald-500 bg-emerald-950/10' },
  { status: 'TAYYOR_OTK', label: 'Tayyor (OTK)', color: 'border-t-amber-500 bg-amber-950/10' },
  { status: 'YOPILDI_USTANOVKA', label: 'O\\'rnatildi (Yopildi)', color: 'border-t-slate-500 bg-slate-900/40' }
];`;

const colsNew = `// Translated in the component render phase, or we can just translate it inline if we move it inside component or use t
// We will move this array inside the component to access t()
`;

// Wait, the columns array is outside the component.
// We should move it inside the component.
content = content.replace(colsOld, "");

const hookInject = `  const { t } = useTranslation();
  
  const columns: { status: OrderStatus; label: string; color: string }[] = [
    { status: 'YANGI_LID', label: t('kanban.col_yangi_lid'), color: 'border-t-blue-500 bg-blue-950/10' },
    { status: 'ZAMER_BELGILANDI', label: t('kanban.col_zamer_belgilandi'), color: 'border-t-indigo-500 bg-indigo-950/10' },
    { status: 'ZAMER_BAJARILDI', label: t('kanban.col_zamer_bajarildi'), color: 'border-t-violet-500 bg-violet-950/10' },
    { status: 'DIZAYN_LOYYAHALASHDA', label: t('kanban.col_dizayn_loyyahalashda'), color: 'border-t-purple-500 bg-purple-950/10' },
    { status: 'DIZAYN_TASDIQLANDI', label: t('kanban.col_dizayn_tasdiqlandi'), color: 'border-t-pink-500 bg-pink-950/10' },
    { status: 'TZ_PLANNER_TUZILDI', label: t('kanban.col_tz_tuzildi'), color: 'border-t-cyan-500 bg-cyan-950/10' },
    { status: 'SHARTNOMA_IMZOLANDI', label: t('kanban.col_shartnoma_imzolandi'), color: 'border-t-teal-500 bg-teal-950/10' },
    { status: 'PRODUCTION', label: t('kanban.col_production'), color: 'border-t-emerald-500 bg-emerald-950/10' },
    { status: 'TAYYOR_OTK', label: t('kanban.col_tayyor'), color: 'border-t-amber-500 bg-amber-950/10' },
    { status: 'YOPILDI_USTANOVKA', label: t('kanban.col_yopildi'), color: 'border-t-slate-500 bg-slate-900/40' }
  ];`;
  
content = content.replace("const { t } = useTranslation();", hookInject);

const rep = {
  "soat kechikdi": "{t('kanban.hours_late')}",
  "kun kechikdi": "{t('kanban.days_late')}",
  "(Bajarilmoqda)": "{t('kanban.in_progress')}",
  "(Kutilmoqda)": "{t('kanban.pending')}",
  "Bosqichlar yo\\'q": "t('kanban.no_stages')",
  "Ishlab Chiqarish Kanban Doskasi": "{t('kanban.title')}",
  "Buyurtmalar va lidxonlik quvuri (CRM-dan yopilgungacha bo'lgan barcha bosqichlar)": "{t('kanban.subtitle')}",
  "Statuslarni o'tkazish uchun kartalardagi <strong>\"Keyingi\"</strong> tugmasini bosing": "{t('kanban.instruction_prefix')} <strong>{t('kanban.instruction_bold')}</strong> {t('kanban.instruction_suffix')}",
  "Ma'lumotlar yuklanmoqda...": "{t('kanban.loading')}",
  "Buyurtmalar mavjud emas": "{t('kanban.no_orders')}",
  "Hozirgi etapi:": "{t('kanban.current_stage')}",
  "Dedlayn: ": "{t('kanban.deadline')} ",
  "mln UZS": "{t('kanban.mln_uzs')}",
  ">Keyingi<": ">{t('kanban.next')}<",
  ">Yopildi<": ">{t('kanban.closed')}<"
};

for (const [key, val] of Object.entries(rep)) {
  content = content.split(key).join(val);
}

fs.writeFileSync(componentPath, content, 'utf-8');
console.log('Component updated for Kanban.');
