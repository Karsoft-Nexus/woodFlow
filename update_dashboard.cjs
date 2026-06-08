const fs = require('fs');
const path = require('path');

const localesPath = path.join('e:', 'karsoft', 'mebel', 'src', 'locales');
const kkPath = path.join(localesPath, 'kk.json');
const ruPath = path.join(localesPath, 'ru.json');

const kk = JSON.parse(fs.readFileSync(kkPath, 'utf-8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8'));

const kkDashboard = {
  "title": "Менеджер Қадағалаў Панели",
  "subtitle": "Ислеп шығарыў қуўатлылығы, режелестириў ҳәм жумысшылар даўаматы анализи",
  "loading": "Мағлыўматлар жүкленбекте...",
  "alert_conflict": "ДИҚҚАТ: Жумысшылар жоқламасында келиспеўшилик анықланды!",
  "alert_absent": "бүгин \"Келмеген (Absent)\" деп белгиленген, бирақ ол",
  "alert_order": "буйыртпасының",
  "alert_stage": "басқышына бириктирилген!",
  "active_orders": "Актив Буйыртпалар",
  "count_items": "та",
  "workshop": "Цехта (Workshop)",
  "count_workers": "та уста",
  "installation": "Орнатыўда (Installation)",
  "late_stages": "Кешиккен Басқышлар",
  "gantt_title": "Жойбар Басқышлары Timeline (Gantt)",
  "no_active_orders": "Ҳәзирде ислеп шығарыўда буйыртпалар жоқ.",
  "plan": "Реже:",
  "stage_worker": "Этап / Жумысшы",
  "actual": "Әмелде:",
  "in_progress_big": "Үлкен процессте",
  "unassigned": "Бириктирилмеген",
  "daily_ops": "Бүгинги Тезкор Операциялар (Daily Ops)",
  "no_daily_ops": "Бүгин жуўмақланатуғын операциялар жоқ.",
  "is_late": "Кешикпекте",
  "worker_absent": "Келмеген уста!",
  "deadline": "Дедлайн:",
  "responsible_worker": "Жуўапкер уста:",
  "assign_worker": "Уста бириктириў...",
  "attendance_title": "Күнлик Жоқлама ҳәм Даўамат",
  "attendance_desc": "Менеджер ҳәр күни азанда усталардың физикалық жағдайын тастыйықлаўы тийис. Олардың жағдайы басқышларға бириктирилиўине тәсир етеди.",
  "status_workshop": "Цехта",
  "status_install": "Орнатыўда",
  "status_absent": "Келмеген",
  "active_job": "Актив жумыста!"
};

const ruDashboard = {
  "title": "Панель Управления Менеджера",
  "subtitle": "Анализ производственных мощностей, планирование и посещаемость рабочих",
  "loading": "Загрузка данных...",
  "alert_conflict": "ВНИМАНИЕ: Обнаружен конфликт в табеле посещаемости!",
  "alert_absent": "сегодня отмечен как \"Отсутствует (Absent)\", но он",
  "alert_order": "прикреплен к заказу",
  "alert_stage": "на этапе!",
  "active_orders": "Активные Заказы",
  "count_items": "шт",
  "workshop": "В Цеху (Workshop)",
  "count_workers": "мастеров",
  "installation": "На установке (Installation)",
  "late_stages": "Просроченные этапы",
  "gantt_title": "Таймлайн этапов проекта (Диаграмма Ганта)",
  "no_active_orders": "В настоящее время нет заказов в производстве.",
  "plan": "План:",
  "stage_worker": "Этап / Рабочий",
  "actual": "Факт:",
  "in_progress_big": "В большом процессе",
  "unassigned": "Не назначен",
  "daily_ops": "Сегодняшние Операции (Daily Ops)",
  "no_daily_ops": "Сегодня нет завершающихся операций.",
  "is_late": "Просрочено",
  "worker_absent": "Мастер отсутствует!",
  "deadline": "Дедлайн:",
  "responsible_worker": "Ответственный мастер:",
  "assign_worker": "Назначить мастера...",
  "attendance_title": "Ежедневная Посещаемость",
  "attendance_desc": "Менеджер должен каждое утро подтверждать физическое присутствие мастеров. Их статус влияет на назначение на этапы.",
  "status_workshop": "В Цеху",
  "status_install": "На Установке",
  "status_absent": "Отсутствует",
  "active_job": "Активен в работе!"
};

kk.dashboard = kkDashboard;
ru.dashboard = ruDashboard;

fs.writeFileSync(kkPath, JSON.stringify(kk, null, 2), 'utf-8');
fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf-8');
console.log('Locales updated for Dashboard.');

// Component Update
const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'production', 'ManagerDashboard.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

if (!content.includes("useTranslation")) {
  content = content.replace(
    "import { useStore } from '../../store/useStore';",
    "import { useStore } from '../../store/useStore';\nimport { useTranslation } from 'react-i18next';"
  );
  content = content.replace(
    "export const ManagerDashboard: React.FC = () => {",
    "export const ManagerDashboard: React.FC = () => {\n  const { t } = useTranslation();"
  );
}

const rep = {
  "Menejer Nazorat Paneli": "{t('dashboard.title')}",
  "Ishlab chiqarish quvvati, rejalashtirish va ishchilar davomati tahlili": "{t('dashboard.subtitle')}",
  "Ma'lumotlar yuklanmoqda...": "{t('dashboard.loading')}",
  "DIQQAT: Ishchilar yo'qlamasida kelishmovchilik aniqlandi!": "{t('dashboard.alert_conflict')}",
  "bugun <strong>\"Kelmagan (Absent)\"</strong> deb belgilangan, biroq u <strong>": "{t('dashboard.alert_absent')} <strong>",
  " buyurtmasining <strong>": " {t('dashboard.alert_order')} <strong>",
  " bosqichiga biriktirilgan!": " {t('dashboard.alert_stage')}",
  ">Faol Buyurtmalar<": ">{t('dashboard.active_orders')}<",
  " ta</h3>": " {t('dashboard.count_items')}</h3>",
  ">Sexda (Workshop)<": ">{t('dashboard.workshop')}<",
  " ta usta</h3>": " {t('dashboard.count_workers')}</h3>",
  ">O'rnatishda (Installation)<": ">{t('dashboard.installation')}<",
  ">Kechikkan Bosqichlar<": ">{t('dashboard.late_stages')}<",
  "Loyiha Bosqichlari Timeline (Gantt)": "{t('dashboard.gantt_title')}",
  "Hozirda ishlab chiqarishda buyurtmalar mavjud emas.": "{t('dashboard.no_active_orders')}",
  "Reja: ": "{t('dashboard.plan')} ",
  "Etap / Worker": "{t('dashboard.stage_worker')}",
  "Amalda: ": "{t('dashboard.actual')} ",
  "Katta jarayonda": "{t('dashboard.in_progress_big')}",
  "'Biriktirilmagan'": "t('dashboard.unassigned')",
  "Bugungi Tezkor Operatsiyalar (Daily Ops)": "{t('dashboard.daily_ops')}",
  "Bugun yakunlanadigan operatsiyalar yo'q.": "{t('dashboard.no_daily_ops')}",
  "Kechikmoqda": "{t('dashboard.is_late')}",
  "Kelmagan usta!": "{t('dashboard.worker_absent')}",
  "Dedlayn: ": "{t('dashboard.deadline')} ",
  "Mas'ul usta:": "{t('dashboard.responsible_worker')}",
  "Usta biriktirish...": "{t('dashboard.assign_worker')}",
  "Kunlik Yo'qlama & Davomat": "{t('dashboard.attendance_title')}",
  "Menejer har kuni ertalab ustalar jismoniy holatini tasdiqlashi lozim. Ular holati bosqichlarga bog'lanishni taqiqlaydi.": "{t('dashboard.attendance_desc')}",
  ">Sexda<": ">{t('dashboard.status_workshop')}<",
  ">O'rnatishda<": ">{t('dashboard.status_install')}<",
  ">Kelmagan<": ">{t('dashboard.status_absent')}<",
  "⚠️ Faol ishda!": "⚠️ {t('dashboard.active_job')}",
  " title=\"Sexda (Workshop)\"": " title={t('dashboard.workshop')}",
  " title=\"O'rnatishda (Installation)\"": " title={t('dashboard.installation')}",
  " title=\"Kelmagan (Absent)\"": " title={t('dashboard.status_absent')}"
};

for (const [key, val] of Object.entries(rep)) {
  content = content.split(key).join(val);
}

fs.writeFileSync(componentPath, content, 'utf-8');
console.log('Component updated for Dashboard.');
