import { CardData } from "./card.d.ts";

export function getData (dbPath: string, id: string): Promise<Object>;

export function getMultiData (dbPath: string, ids: string | string[]): Promise<Object[]>;

export function getCard (data: CardData, config: {
  picPath: string,
  moldPath: string,
  type: 'image/png' | 'image/jpeg',
  size: number,
}): Buffer;

export function variation (data: Object): CardData;
