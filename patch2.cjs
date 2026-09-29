const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

const updated = content.replace(
  'const targetPath = req.query.path;',
  'const targetPath = req.query.path as string;'
);
fs.writeFileSync('server.ts', updated);
