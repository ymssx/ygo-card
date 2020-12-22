import { createCanvas } from 'canvas';

const PER_ROW = 3, PER_PAGE = 9;
const A4_W = 2480, A4_H = 3508;
const CARD_W = 697, CARD_H = 1016;
const INIT_X = 193, INIT_Y = 229;

export async function renderDeckPDF(cards) 
    const pdfCanvas = createCanvas(A4_W, A4_H, 'pdf');
    const ctx = pdfCanvas.getContext('2d');
    for (const i in cards) {
        if(i != 0 && i % PER_PAGE === 0 && i !== cards.length - 1) {
            await ctx.addPage();
        }
        const card = cards[i];
        const cardCanvas = await card.render();
        const x = (i % PER_PAGE) % PER_ROW, y = Math.floor((i % PER_PAGE) / PER_ROW);
        ctx.drawImage(cardCanvas, INIT_X + x * (CARD_W + 1), INIT_Y + y * (CARD_H + 1), CARD_W, CARD_H);
    }
    
    return pdfCanvas;
}
