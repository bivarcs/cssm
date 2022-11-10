var attachE = document.getElementById("attach");
var detachE = document.getElementById("detach");

const cssm = new CSSM;

console.log("CSSM", cssm);

cssm.create("demo", `body{background-color:red}`);

class Hoge {
  constructor() {
    this.status = true;
  }

  destroy() {
    this.status = false;
  }
}

let hoge;

attachE.addEventListener("click", () => {
  if (hoge && hoge.status) {
    hoge.destroy();
  }

  hoge = new Hoge;

  console.log("click");

  cssm.attach("demo", hoge, "status");
});

detachE.addEventListener("click", () => {
  if (hoge && hoge.status) {
    hoge.destroy();
    cssm.update();
  }
});