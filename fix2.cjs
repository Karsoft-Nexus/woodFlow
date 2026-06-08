const fs = require('fs');
const path = require('path');

const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'inventory', 'InventoryBOM.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

// Substring replacements
const replacements = [
  { from: "Omborxona va Xomashyo Boshqaruvi", to: "{t('inventory.title')}" },
  { from: "Ombor Qoldiqlari\n          </button>", to: "{t('inventory.tab_stock')}\n          </button>" },
  { from: "Kirim-Chiqim Tarixi\n          </button>", to: "{t('inventory.tab_transactions')}\n          </button>" },
  { from: "BOM (Retsept) Muharriri\n          </button>", to: "{t('inventory.tab_bom')}\n          </button>" },
  { from: "Faqat tugayotgan tovarlar\n                </label>", to: "{t('inventory.low_stock_only')}\n                </label>" },
  { from: "BOMga Qo'shish\n                      </button>", to: "{t('inventory.add_to_bom_btn')}\n                      </button>" },
  { from: "Bekor qilish\n                </button>", to: "{t('inventory.cancel')}\n                </button>" },
  { from: "Amalga oshirish\n                </button>", to: "{t('inventory.submit')}\n                </button>" },
  { from: "Faqat tugayotgan tovarlar", to: "{t('inventory.low_stock_only')}" },
  { from: "Kirim / Chiqim Qilish", to: "{t('inventory.add_transaction')}" }
];

for (const { from, to } of replacements) {
  content = content.replace(from, to);
}

fs.writeFileSync(componentPath, content, 'utf-8');
console.log("Fixed missing strings.");
