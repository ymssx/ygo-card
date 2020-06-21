export class CardData {
  constructor(card, data) {
    this.card = card;
    this.data = new Proxy();
  }


  callUpdate() {
    this.card.painter.update();
  }
}