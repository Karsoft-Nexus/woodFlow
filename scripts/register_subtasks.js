/**
 * WoodFlow ERP - AI Agent Subtask Register Script
 * Mocks the registration of subtasks to the Vercel Kanban board for local development.
 */

const agent = process.argv[2];

if (!agent) {
  console.error("Xatolik: Iltimos, agent nomini kiriting (agent1, agent2, yoki agent3)!");
  process.exit(1);
}

const subtasks = {
  agent1: [
    "CRM: Yangi lid yaratish formasi",
    "CRM: Zamerchik biriktirish va zamer rejasi",
    "CRM: Zamer o'lchovlari va eskiz rasmlarini yuklash shakli",
    "CRM: 3D dizayn chizmalarini yuklash va tasdiqlash",
    "CRM: Mini-TZ bosqichlari va kunbay rejalashtirish shakli",
    "CRM: Shartnoma generatsiyasi (O'zR FK talablariga mos)",
    "CRM: Oq fondagi print-friendly shartnoma layout (@media print)"
  ],
  agent2: [
    "Inventory: Ombor qoldiqlari, rezervlar va mavjud miqdorlar jadvali",
    "Inventory: Minimal qoldiq chegarasi (minThreshold) qizil ogohlantiruvchi widget",
    "Inventory: Yangi tovar kirim va chiqim qilish formasi (Transactions)",
    "Inventory: Ombor operatsiyalari va tranzaksiyalar tarixi",
    "BOM: Buyurtmaga xomashyo retseptini biriktirish va tahrirlash",
    "BOM: Dinamik tannarx hisoblagich",
    "BOM: Materiallarni bron qilish va ombordan chegirish triggeri"
  ],
  agent3: [
    "Production: 10 bosqichli kengaytirilgan Kanban doskasi",
    "Production: Kechikkan bosqichlar uchun visual miltillovchi qizil Late Alert",
    "Manager: planned vs actual vaqtlarni solishtiruvchi gorizontal Gantt Timeline",
    "Manager: Ustalar kunlik yo'qlamasi (Sexda, O'rnatishda, Kelmagan)",
    "Worker Tablet: planshet uchun PIN-kodli usta login ekrani",
    "Worker Tablet: Usta statusiga qarab topshiriq filteri va Start/Finish tugmalari",
    "Finance Ledger: Kirim/chiqim, kassadagi balans va yangi tranzaksiya formasi"
  ]
};

const agentTasks = subtasks[agent.toLowerCase()];

if (!agentTasks) {
  console.error(`Xatolik: Noma'lum agent "${agent}". Faqat: agent1, agent2, agent3.`);
  process.exit(1);
}

console.log("\x1b[36m%s\x1b[0m", `[WoodFlow Kanban] ${agent.toUpperCase()} uchun subtasklar ro'yxatdan o'tkazilmoqda...`);
console.log("------------------------------------------------------------------");

agentTasks.forEach((task, idx) => {
  setTimeout(() => {
    console.log(`\x1b[32m✔\x1b[0m Subtask [${idx + 1}/${agentTasks.length}]: "${task}" -> [Qilinishi kerak]`);
    if (idx === agentTasks.length - 1) {
      console.log("------------------------------------------------------------------");
      console.log("\x1b[35m%s\x1b[0m", `[Muvaffaqiyatli] Barcha 7 ta subtask Vercel Kanban doskasiga yuklandi!`);
    }
  }, (idx + 1) * 200);
});
