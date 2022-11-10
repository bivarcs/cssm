const packageJson = require('../package.json');

const fs = require("fs");
const path = require("path");
const rollup = require('rollup').rollup;
const esbuild = require('rollup-plugin-esbuild').default;
const babel = require('@rollup/plugin-babel');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const uglify = require('uglify-js');

exports.buildJs = async function (options) {
  await (await rollup({
    input: `./src/js/index.ts`,
    plugins: [
      resolve(),
      esbuild({ minify: false }),
      babel.getBabelOutputPlugin({
        configFile: path.resolve(__dirname, '../.babelrc'),
        allowAllFormats: true,
      }),
      options.minify ? {
        name: 'minify',
        renderChunk(code) {
          const result = uglify.minify(code, {
            sourceMap: true,
            output: {
              comments: /^!/,
            },
            toplevel: true,
            mangle: {
              properties: {
                regex: /^_/,
              },
            },
          });

          if (result.error) {
            throw new Error(result.error);
          }

          return result;
        },
      } : false,
    ],
  })).write({
    ...{
      banner: `/*! ${packageJson.name} ${packageJson.version} | ${packageJson.license} | ${packageJson.homepage} */`,
      file: './dist/js/' + options.name + ('umd' !== options.format ? '.' + options.format : '') + (options.minify ? '.min' : '') + ".js",
      format: options.format,
      name: packageJson.com_bivarcs.constructor.name,
      sourcemap: options.sourcemap,
    },
    ...(options.exports ? {
      exports: options.exports,
    } : {})
  });
};

const syncDir = function (src, dist) {
  if (fs.existsSync(src)) {
    var stats = fs.statSync(src);

    if (stats.isDirectory()) {
      fs.mkdirSync(dist);

      fs.readdirSync(src).forEach(function (file) {
        syncDir(path.join(src, file), path.join(dist, file));
      });
    } else {
      fs.copyFileSync(src, dist);
    }
  }
}

exports.syncDir = syncDir;
