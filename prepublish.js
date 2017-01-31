const fs = require('fs-extra');
const pkg = require('./package');

delete pkg.private;
delete pkg.scripts;

fs.mkdirsSync('dist');
fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2), { encoding: 'utf-8' });
