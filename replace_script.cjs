const fs = require('fs');
const path = require('path');

const filePath = path.join('e:', 'karsoft', 'mebel', 'src', 'pages', 'orders', 'OrdersCRM.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const replacementsPath = path.join('e:', 'karsoft', 'mebel', 'replacements.json');
const replacements = JSON.parse(fs.readFileSync(replacementsPath, 'utf-8'));

for (const [oldText, newText] of Object.entries(replacements)) {
    content = content.split(oldText).join(newText);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Done replacing strings.');