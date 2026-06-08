const fs = require('fs');
const path = require('path');

const localesPath = path.join('e:', 'karsoft', 'mebel', 'src', 'locales');
const kkPath = path.join(localesPath, 'kk.json');
const ruPath = path.join(localesPath, 'ru.json');

const kk = JSON.parse(fs.readFileSync(kkPath, 'utf-8'));
const ru = JSON.parse(fs.readFileSync(ruPath, 'utf-8'));

const kkTablet = {
  "err_absent": "Сиз бүгин \"Келмеген\" деп белгиленгенсиз. Илтимас, менеджерге мүрәжат қылың!",
  "err_wrong_pin": "Қәте ПИН-код! Қайтадан урынып көриң.",
  "err_no_history": "Орынланған жумыслар тарийхы табылмады.",
  "err_no_tasks": "Ҳәзирше сиз ушын ҳеш қандай бос тапсырма жоқ.",
  "loading": "Мағлыўматлар жүкленбекте...",
  "title": "Усталар Доскасы (Планшет Панели)",
  "subtitle": "Цехтағы планшет ҳәм мобиль телефонлар ушын икемлестирилген интерфейс",
  "logout": "Системадан Шығыў",
  "login_title": "Цех Системасына Кириў",
  "login_desc": "Уста ИД Пин-кодын киритиң (Масалан: w1 уста ушын \"1111\", w10 уста ушын \"0000\")",
  "btn_clear": "ТАЗАЛАЎ",
  "btn_delete": "ӨШИРИЎ",
  "btn_login": "КИРИЎ",
  "status_workshop": "Цехта",
  "status_install": "Орнатыўда",
  "worker_rating": "Уста Рейтинги",
  "worker_balance": "Жумысбай Баланс",
  "currency_som": "сум",
  "currency_uzs": "UZS",
  "history_title": "Орынланған Жумыслар ҳәм Төлемлер",
  "tasks_title": "Сизге Тийисли Тапсырмалар",
  "tasks_active": "та актив",
  "task_in_progress": "Орынланбақта",
  "deadline": "Дедлайн:",
  "task_fee": "Жумысбай ҳақы:",
  "btn_start": "Баслаў",
  "btn_finish": "Тамамлаў",
  "offcut_title": "Раскрой Қалдық Бөлеги",
  "offcut_desc": "Арра (Раскрой) басқышынан кейин келеси буйыртпаларда қайта пайдаланыў ушын жарамлы ДСП/МДФ плита қалдық бөлеги қалды ма?",
  "plate_type": "Плита Түри",
  "in_stock": "дана бар",
  "length_m": "Узынлығы (метр)",
  "width_m": "Ени (метр)",
  "eg_length": "Масалан: 1.2",
  "eg_width": "Масалан: 0.8",
  "btn_no_offcut": "ҚАЛДЫҚ ҚАЛМАДЫ",
  "btn_save_offcut": "ҚАЛДЫҚТЫ САҚЛАЎ"
};

const ruTablet = {
  "err_absent": "Вы сегодня отмечены как \"Отсутствует\". Пожалуйста, обратитесь к менеджеру!",
  "err_wrong_pin": "Неверный ПИН-код! Попробуйте снова.",
  "err_no_history": "История выполненных работ не найдена.",
  "err_no_tasks": "В настоящее время для вас нет свободных заданий.",
  "loading": "Загрузка данных...",
  "title": "Доска Мастеров (Панель Планшета)",
  "subtitle": "Интерфейс адаптирован для планшетов и телефонов в цеху",
  "logout": "Выйти из Системы",
  "login_title": "Вход в Систему Цеха",
  "login_desc": "Введите ПИН-код мастера (Например: для мастера w1 - \"1111\", для w10 - \"0000\")",
  "btn_clear": "ОЧИСТИТЬ",
  "btn_delete": "УДАЛИТЬ",
  "btn_login": "ВОЙТИ",
  "status_workshop": "В Цеху",
  "status_install": "На Установке",
  "worker_rating": "Рейтинг Мастера",
  "worker_balance": "Сдельный Баланс",
  "currency_som": "сум",
  "currency_uzs": "UZS",
  "history_title": "Выполненные Работы и Выплаты",
  "tasks_title": "Ваши Задания",
  "tasks_active": "активных",
  "task_in_progress": "Выполняется",
  "deadline": "Дедлайн:",
  "task_fee": "Сдельная оплата:",
  "btn_start": "Начать",
  "btn_finish": "Завершить",
  "offcut_title": "Остаток после Раскроя",
  "offcut_desc": "Остался ли кусок ДСП/МДФ, пригодный для использования в будущих заказах после распила?",
  "plate_type": "Тип Плиты",
  "in_stock": "шт в наличии",
  "length_m": "Длина (метр)",
  "width_m": "Ширина (метр)",
  "eg_length": "Например: 1.2",
  "eg_width": "Например: 0.8",
  "btn_no_offcut": "ОСТАТКОВ НЕТ",
  "btn_save_offcut": "СОХРАНИТЬ ОСТАТОК"
};

kk.tablet = kkTablet;
ru.tablet = ruTablet;

fs.writeFileSync(kkPath, JSON.stringify(kk, null, 2), 'utf-8');
fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf-8');
console.log('Locales updated for Tablet.');

// Component Update
const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'worker', 'WorkerTablet.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

if (!content.includes("useTranslation")) {
  content = content.replace(
    "import { productionApi } from '../../api';",
    "import { productionApi } from '../../api';\nimport { useTranslation } from 'react-i18next';"
  );
  content = content.replace(
    "export const WorkerTablet: React.FC = () => {",
    "export const WorkerTablet: React.FC = () => {\n  const { t } = useTranslation();"
  );
}

// Ensure correct syntax for string interpolation inside backticks
const rep = {
  "'Siz bugun \"Kelmagan\" deb belgilangansiz. Iltimos, menejerga murojaat qiling!'": "t('tablet.err_absent')",
  "'Noto\\'g\\'ri PIN-kod! Qaytadan urinib ko\\'ring.'": "t('tablet.err_wrong_pin')",
  "Bajarilgan ishlar tarixi topilmadi.": "{t('tablet.err_no_history')}",
  "Ayni paytda siz uchun hech qanday bo'sh topshiriq mavjud emas.": "{t('tablet.err_no_tasks')}",
  "Ma'lumotlar yuklanmoqda...": "{t('tablet.loading')}",
  "Ustalar Doskasi (Planshet Paneli)": "{t('tablet.title')}",
  "Sexdagi planshet va mobil telefonlar uchun moslashtirilgan interfeys": "{t('tablet.subtitle')}",
  "Tizimdan Chiqish": "{t('tablet.logout')}",
  "Sex Tizimiga Kirish": "{t('tablet.login_title')}",
  "Usta ID Pin-kodini kiriting (Masalan: w1 usta uchun \"1111\", w10 usta uchun \"0000\")": "{t('tablet.login_desc')}",
  ">TOZALASH<": ">{t('tablet.btn_clear')}<",
  ">O'CHIRISH<": ">{t('tablet.btn_delete')}<",
  ">KIRISH<": ">{t('tablet.btn_login')}<",
  "'Sexda' : 'O\\'rnatishda'": "t('tablet.status_workshop') : t('tablet.status_install')",
  "Ustaning Reytingi": "{t('tablet.worker_rating')}",
  "Ishbay Balans": "{t('tablet.worker_balance')}",
  " so'm": " {t('tablet.currency_som')}",
  " UZS": " {t('tablet.currency_uzs')}",
  "Bajarilgan Ishlar & Payoutlar": "{t('tablet.history_title')}",
  "Sizga Tegishli Topshiriqlar": "{t('tablet.tasks_title')}",
  " ta faol": " {t('tablet.tasks_active')}",
  "Bajarilmoqda": "{t('tablet.task_in_progress')}",
  "Dedlayn:": "{t('tablet.deadline')}",
  "Ishbay haq: ": "{t('tablet.task_fee')} ",
  "Boshlash (Start)": "{t('tablet.btn_start')}",
  "Tugatish (Finish)": "{t('tablet.btn_finish')}",
  "Raskroy Qoldiq Bo'lagi": "{t('tablet.offcut_title')}",
  "Arra bosqichidan keyin kelasi buyurtmalarda qayta foydalanish uchun mos bo'lgan DSP/MDF plita qoldiq bo'lagi qoldimi?": "{t('tablet.offcut_desc')}",
  "Plita Turi": "{t('tablet.plate_type')}",
  " dona bor)": " {t('tablet.in_stock')})",
  "Bo'yi (metr)": "{t('tablet.length_m')}",
  "Eni (metr)": "{t('tablet.width_m')}",
  "\"Masalan: 1.2\"": "{t('tablet.eg_length')}",
  "\"Masalan: 0.8\"": "{t('tablet.eg_width')}",
  "QOLDIQ QOLMADI": "{t('tablet.btn_no_offcut')}",
  "QOLDIQNI SAQLASH": "{t('tablet.btn_save_offcut')}"
};

for (const [key, val] of Object.entries(rep)) {
  if (key.includes('Masalan')) {
    // For placeholder strings we replace the quoted string with {t('...')} but since it's inside an attribute, it should be just placeholder={t('...')}
    content = content.replace(`placeholder=${key}`, `placeholder=${val}`);
  } else {
    content = content.split(key).join(val);
  }
}

fs.writeFileSync(componentPath, content, 'utf-8');
console.log('Component updated for Tablet.');
