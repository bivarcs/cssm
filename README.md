# CSSM
![](https://img.shields.io/npm/types/@bivarcs/cssm)
![](https://img.shields.io/node/v/@bivarcs/cssm)
![](https://img.shields.io/github/license/bivarcs/cssm)

Convert JSON to Node.

## Demo
https://bivarcs.github.io/cssm/demo/

## Installation
### Package Manager
npm: `npm i @bivarcs/cssm`  
yarn: `yarn add @bivarcs/cssm`  

A command is needed to prepare dependent libraries.

```
npm run dev:setup
```

### CDN
```js
<script src="https://unpkg.com/@bivarcs/cssm/dist/js/cssm.min.js"></script>
```

## Document
- [API Documentation](https://bivarcs.github.io/cssm/docs/) (via: [Typedoc](https://github.com/TypeStrong/typedoc))

## Usage

### source
If source1 and source2 use the same style.

```js
// any class
class Hoge {
  constructor() {
    this.status = true;
  }

  destroy() {
    this.status = false;
  }
}

// source instance
const source1 = new Hoge;
const source2 = new Hoge;

// Associate the source with a style.
const cssm = new CSSM;
```

### load
When loading from a URL, the URL becomes the ID.

```js
cssm.load("path/to/style.css")
.then((id) => { // id = "path/to/style.css"
  cssm.attach(id, source1, (source) => {  // How to verify that the instance is alive.
    return source.status;
  });

  cssm.attach(id, source2, (source) => {
    return source.status;
  });

  // same
  // If the specified property (status) is true, it is alive)
  // cssm.attach(id, source1, "status");
  // cssm.attach(id, source2, "status");
});
```

### create
You can create style elements directly. Specify a unique ID.

```js
cssm.create("someId", `body{background-color:red}`);

cssm.attach("someId", source1, "status");
cssm.attach("someId", source2, "status");
```

### update (Auto remove)
With `update()`, determine if a style element is needed.
If all sources associated with a style are lost, the style is deleted.

```js
source1.destroy();

// Because there is still source2, the style element is not removed.
cssm.update();

source2.destroy();

// source1 and source2 were destoryed.
// Since there is no associated instance, the style element is removed.
cssm.update();
```

## License
CSSM is available under the [MIT license](LICENSE.md).
