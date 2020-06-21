import { CardPainterChip } from "./cardPainterChip";

export class CardPainter {
  card: Card;
  constructor(card: Card, painterChips: CardPainterChip[]) {
    this.card = card;
    this.chips = painterChips;
  }


  render() {
    return Promise.all(this.chips.map(chip => {
      return chip.render();
    }));
  }
}