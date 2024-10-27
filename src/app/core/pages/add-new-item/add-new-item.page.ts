import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Observable, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';

import { Feature } from 'ol';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { isPlatformBrowser } from '@angular/common';
import { AdvisorCommonModule } from '../../../shared/advisor-common.module';
import { Item, ItemCategory, ItemCategoryKey } from '../../../interface/item';
import { FirestoreService } from '../../../services/firestore.service';
import { ItemService } from '../../../services/item.service';


@Component({
  selector: 'app-add-new-place',
  standalone: true,
  imports: [AdvisorCommonModule, MatAutocompleteModule],
  templateUrl: './add-new-item.page.html',
  styleUrl: './add-new-item.page.scss'
})
export class AddNewItemPage implements OnInit {

  protected itemService = inject(ItemService)

  protected firestoreService = inject(FirestoreService)

  public categoryList: ItemCategory[] = [
    {
      src: '/icons/restaurant.png',
      label: 'Ètterem',
      key: ItemCategoryKey.RESTAURANT
    },
    {
      src: '/icons/cake.png',
      label: 'Cukrászda',
      key: ItemCategoryKey.CAKE
    },
    {
      src: '/icons/hotel.png',
      label: 'Hotel',
      key: ItemCategoryKey.HOTEL
    },
    {
      src: '/icons/shop.png',
      label: 'Bolt',
      key: ItemCategoryKey.SHOP
    },
  ];

  public freeFromList: string[] = ['Gluténmentes', 'Laktózmentes', 'Vegán'];

  public map!: Map;

  public vectorSource = new VectorSource();


  public itemForm: FormGroup = new FormGroup ({
    title: new FormControl('', Validators.required),
    description: new FormControl(null),
    category: new FormControl('', Validators.required),
    freeFrom: new FormControl('', Validators.required),
    opening: new FormControl(null),
    address: new FormControl('', Validators.required),
  })

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Run only in Browser
      this.initializeMap();
    }
  }

  // Initialisiere die OpenLayers-Karte
  initializeMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([19.0402, 47.4979]), // Start at Budapest
        zoom: 7
      })
    });

    // Layer für Marker
    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    this.map.addLayer(vectorLayer);
  }

  onSubmit() {
    const address = this.itemForm.get('address')?.value; // Wert des Inputfeldes abrufen
    if (address) {
      this.geocodeAddress(address); // Geokodierung der Adresse
    } else {
      alert('Kérlek írj be egy címet.');
    }
  }

  // Wenn eine Adresse ausgewählt wird
  onOptionSelected(event: any): void {
    console.log(event)
    const address = event.option.value;

    // Platziere den Pin auf der Karte
    this.geocodeAddress(address);
  }

  private geocodeAddress(address: string): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    this.http.get<any[]>(url).subscribe(data => {
      if (data.length > 0) {
        const { lat, lon, } = data[0]; // Nimm die erste Übereinstimmung

        // Platziere den Pin auf der Karte
        this.addMarkerToMap(lat, lon);
      } else {
        alert('Adresse nicht gefunden.');
      }
    }, error => {
      console.error('Error beim Geocoding:', error);
      alert('Fehler bei der Adresseingabe.');
    });
  }

  /**
   * Add Market to Map
   * 
   * @param lat - latitude
   * @param lon - longitude
   */
  addMarkerToMap(lat: string, lon: string): void {
    const coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);

    // Entferne alte Marker (optional)
    this.vectorSource.clear();

    // Erstelle den Marker
    const addressMarker = new Feature({
      geometry: new Point(coordinates),
    });

    // Marker-Stil
    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: '/icons/restaurant.png', // Pfad zu deinem Marker-Symbol
        scale: 0.5
      })
    });
    addressMarker.setStyle(markerStyle);

    // Füge den Marker zur Vektorquelle hinzu
    this.vectorSource.addFeature(addressMarker);

    // Zentriere die Karte auf die neue Position
    this.map.getView().setCenter(coordinates);
    this.map.getView().setZoom(15); // Zoom auf die neue Position
  }


  saveItem() {
    console.log('Form submitted:', this.itemForm)

    if (this.itemForm.valid) {
      this.firestoreService.addNewItemToFirestore(this.itemForm.value).subscribe((addedItemId) => {
        this.itemService.addItem(this.itemForm.value, addedItemId)
        this.itemForm.reset()
      })

      console.log(this.itemService.itemSig())
  
    } else {
      console.log('Form is not valid');
    }
  }



}
