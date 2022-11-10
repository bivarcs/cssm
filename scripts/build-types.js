const { default: dts } = require('rollup-plugin-dts');
const { rollup } = require('rollup');
const { promises: fs } = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const dir = './dist/types';

(async function () {
  await exec('node_modules/.bin/tsc --emitDeclarationOnly');

  const file = path.join(dir, 'index.d.ts');

  await (await rollup({
    input: file,
    plugins: [dts({ respectExternal: true })],
  })).write({ file });

  await Promise.all((await fs.readdir(dir)).filter(file => 'index.d.ts' !== file).map(file => fs.rm(path.join(dir, file), { recursive: true, force: true })));
}()).catch(console.error);