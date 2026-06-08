const fs = require('fs');
const path = require('path');

const componentPath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'inventory', 'InventoryBOM.tsx');
let content = fs.readFileSync(componentPath, 'utf-8');

const replacements = [
  {
    from: ">\n            Ombor Qoldiqlari\n          </button>",
    to: ">\n            {t('inventory.tab_stock')}\n          </button>"
  },
  {
    from: ">\n            Kirim-Chiqim Tarixi\n          </button>",
    to: ">\n            {t('inventory.tab_transactions')}\n          </button>"
  },
  {
    from: ">\n            BOM (Retsept) Muharriri\n          </button>",
    to: ">\n            {t('inventory.tab_bom')}\n          </button>"
  },
  {
    from: "/>\n                  Faqat tugayotgan tovarlar\n                </label>",
    to: "/>\n                  {t('inventory.low_stock_only')}\n                </label>"
  },
  {
    from: "<Plus className=\"w-4 h-4\" /> BOMga Qo'shish\n                      </button>",
    to: "<Plus className=\"w-4 h-4\" /> {t('inventory.add_to_bom_btn')}\n                      </button>"
  },
  {
    from: ">\n                  Bekor qilish\n                </button>",
    to: ">\n                  {t('inventory.cancel')}\n                </button>"
  },
  {
    from: ">\n                  Amalga oshirish\n                </button>",
    to: ">\n                  {t('inventory.submit')}\n                </button>"
  }
];

let replacedCount = 0;
for (const { from, to } of replacements) {
  if (content.includes(from)) {
    content = content.replace(from, to);
    replacedCount++;
  } else {
    console.log("Could not find:", from.trim());
  }
}

fs.writeFileSync(componentPath, content, 'utf-8');
console.log(`Replaced ${replacedCount} missed strings.`);
