const fs = require('node:fs');
const path = require('node:path');

for (const target of ['build', 'plugin/build']) {
  fs.rmSync(path.join(process.cwd(), target), { recursive: true, force: true });
}
