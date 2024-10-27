import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Item } from '../interface/item';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore)

  // items$: Observable<Item[]>

  // this is a reference to the items collection from which we want to get our data
  itemCollection: CollectionReference = collection(this.firestore, 'items')

  /**
   * Get all item from firestore.
   * By defoult we wont get ids back, so we use 'idField' to update Item[] with IDs from firestore
   * 
   * @returns - array of Items
   */
  getItems(): Observable<Item[]> {
    return collectionData(this.itemCollection, {
      idField: 'id'
    }) as Observable<Item[]>
  }

  constructor() {
    // get a reference to the item collection
    // const itemCollections = collection(this.firestore, 'items')

    // get documents (data) from the collection using collectionData
    // this.items$ = collectionData(itemCollections) as Observable<Item[]>
   }

  public addNewItemToFirestore(newItem: Item): Observable<string> {
    const promise =  addDoc(this.itemCollection, newItem).then(response => {
      return response.id
    })
    return from(promise)
  }

  public removeItem(itemId: string): Observable<void> {
    const docRef = doc(this.firestore, 'items/' + itemId)
    const promise = deleteDoc(docRef)
    return from(promise)
  }

  public updateItem(itemID: string, dataToUpdate: Item): Observable<void> {
    const docRef = doc(this.firestore, 'items/' + itemID)
    const promise = setDoc(docRef, dataToUpdate)
    return from(promise)
  }
}
