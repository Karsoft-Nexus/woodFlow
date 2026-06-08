const fs = require('fs');
const path = require('path');

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

// Remove the outer columns
const colsRegex = /const columns: { status: OrderStatus; label: string; color: string }\[\] = \[\s*\{ status: 'YANGI_LID'[\s\S]*?\];/m;
content = content.replace(colsRegex, "");

// Inject the inner columns
if (!content.includes("const columns: { status: OrderStatus; label: string; color: string }[] = [")) {
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
  
  content = content.replace("  const { t } = useTranslation();", hookInject);
}

// Fix string literals inside variables / JSX
const rep = {
  "`${diffHours} soat kechikdi`": "`${diffHours} ${t('kanban.hours_late')}`",
  "`${diffDays} kun kechikdi`": "`${diffDays} ${t('kanban.days_late')}`",
  "`${active.stageName} (Bajarilmoqda)`": "`${active.stageName} ${t('kanban.in_progress')}`",
  "`${pending.stageName} (Kutilmoqda)`": "`${pending.stageName} ${t('kanban.pending')}`",
  "'Bosqichlar yo\\'q'": "t('kanban.no_stages')",
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
console.log('KanbanBoard.tsx fixed.');
