import { Injectable, signal } from '@angular/core';
import { Item } from '../interface/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemSig = signal<Item[]>([])

  addItem(item: Item, id: string): void {
    const newItem: Item = {
      ...item,
      id
    }
    this.itemSig.update((items) => [...items, newItem])
  }
}
