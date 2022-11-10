const buildJs = require('./utils').buildJs;
const packageJson = require('../package.json');
const name = packageJson.name.split("/").pop();

Promise.all([
  buildJs({
    minify: false,
    name,
    format: 'cjs',
    sourcemap: false,
    exports: 'named',
  }),
  buildJs({
    minify: true,
    name,
    format: 'cjs',
    sourcemap: false,
    exports: 'named',
  }),
  buildJs({
    minify: false,
    name,
    format: 'esm',
    sourcemap: false,
    exports: 'named',
  }),
  buildJs({
    minify: true,
    name,
    format: 'esm',
    sourcemap: false,
    exports: 'named',
  }),
]).catch(console.error);