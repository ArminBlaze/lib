'use strict';

import Menu from './menu'; // ./menu/index.js

let menu = new Menu({
  title: "Сладости",
  items: [{
    title: "Конфеты",
    href:  "candy"
  }, {
    title: "Пирожки",
    href:  "pie"
  }, {
    title: "Пряники",
    href:  "cookies"
  }]
});

document.body.appendChild(menu.getElem());

menu.getElem().addEventListener('menu-select', function(event) {
  alert(event.detail.value);
});

menu.getElem().addEventListener('menu-open', function(event) {
  console.log("open");
});

menu.getElem().addEventListener('menu-close', function(event) {
  console.log("close");
});