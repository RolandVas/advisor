import { Component, inject, Input, OnInit } from '@angular/core';
import { Item } from '../../../interface/item';
import { FirestoreService } from '../../../services/firestore.service';
import { ItemService } from '../../../services/item.service';

@Component({
  selector: 'app-item-presenter',
  standalone: true,
  imports: [],
  templateUrl: './item-presenter.component.html',
  styleUrl: './item-presenter.component.scss'
})
export class ItemPresenterComponent implements OnInit {

  @Input() item: Item | undefined

  itemService = inject(ItemService)

  firebaseService = inject(FirestoreService)

  ngOnInit(): void {
  }

  public deleteItem(): void {
    if (this.item && this.item.id) {
      this.firebaseService.removeItem(this.item.id).subscribe((items) => {
      })
    }
  }

}
