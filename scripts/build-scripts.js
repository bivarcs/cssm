const buildJs = require('./utils').buildJs;
const packageJson = require('../package.json');
const name = packageJson.name.split("/").pop();

Promise.all([
  buildJs({
    format: 'umd',
    minify: false,
    name,
    sourcemap: false
  }),
  buildJs({
    format: 'umd',
    minify: true,
    name,
    sourcemap: false
  }),
]).catch(console.error);