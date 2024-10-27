import { Component, inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { ItemService } from '../../../services/item.service';
import { AdvisorMapComponent } from '../../../shared/componentes/advisor-map/advisor-map.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AdvisorMapComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage implements OnInit {
  itemService = inject(ItemService)

  firebaseService = inject(FirestoreService)

  ngOnInit(): void {
    this.firebaseService.getItems().subscribe((items) => {
      this.itemService.itemSig.set(items)
      console.log('items', this.itemService.itemSig())
    })
  }

}
