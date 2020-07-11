import {Card} from './card.js';

let moldPath;

class YgoCard extends HTMLElement {
  constructor() {
    super();
  }

  createCanvas() {
    const shadow = this.attachShadow({mode: 'closed'});
    const canvas = document.createElement('canvas');
    shadow.appendChild(canvas);

    return canvas;
  }

  async connectedCallback() {
    let password = this.getAttribute('password');
    let data = await (await fetch('http://cose.xyz:7001/card?id=' + password)).json();
    data = Card.transData(data);
    data.desc = data.desc.replace('\n', '')
    const canvas = this.createCanvas();    

    this.card = new Card({
      data,
      canvas,
      size: [813, 1185],
      moldPath
    });
    this.card.render();
  }
}

export const CardDom = function(path) {
  moldPath = path;
  customElements.define('ygo-card', YgoCard);
}
