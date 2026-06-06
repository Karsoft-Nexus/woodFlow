const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
const paths = Object.keys(data.paths);
const tags = {};
paths.forEach(p => {
  Object.keys(data.paths[p]).forEach(m => {
    const t = data.paths[p][m].tags[0];
    if (!tags[t]) tags[t] = [];
    tags[t].push(`${m.toUpperCase()} ${p}`);
  });
});
fs.writeFileSync('api_analysis.json', JSON.stringify(tags, null, 2));
