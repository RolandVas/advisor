import { Component, Inject, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { defaults as defaultInteractions } from 'ol/interaction';

@Component({
  selector: 'advisor-map',
  standalone: true,
  imports: [],
  templateUrl: './advisor-map.component.html',
  styleUrl: './advisor-map.component.scss'
})
export class AdvisorMapComponent implements OnInit {

  public map!: Map;
  public overlay!: Overlay;
  public content!: HTMLElement;
  public closer!: HTMLElement;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Csak böngészőben fut
      this.initializeMap();
    }
  }

  private initializeMap(): void {
    // Initialize map with OpenStreetMap tiles
    this.map = this.createMap();

    // Create overlay (popup)
    this.createPopup();

    // Create restaurant marker and add it to the map
    this.addRestaurantMarker();

    // Setup event listeners for the map
    this.setupMapEvents();
  }

  private createMap(): Map {
    return new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([19.0402, 47.4979]), // Budapest coordinates
        zoom: 13
      }),
      interactions: defaultInteractions(),
    });
  }

  private createPopup(): void {
    // Bind popup HTML elements
    this.content = document.getElementById('popup-content')!;
    this.closer = document.getElementById('popup-closer')!;

    this.closer.onclick = () => {
      this.overlay.setPosition(undefined);
      this.closer.blur();
      return false;
    };

    // Create overlay
    this.overlay = new Overlay({
      element: document.getElementById('popup')!,
      autoPan: true,
    });
    this.map.addOverlay(this.overlay);
  }

  private addRestaurantMarker(): void {
    // Default style for the restaurant marker
    const defaultStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: '/icons/restaurant.png', // Path to custom restaurant icon
        scale: 0.5 // Scale setting
      })
    });

    // Create restaurant marker
    const restaurantMarker = new Feature({
      geometry: new Point(fromLonLat([19.0402, 47.4979])), // Budapest
      name: 'Gluten-Free Restaurant' // Restaurant name
    });

    // Set default style for the marker
    restaurantMarker.setStyle(defaultStyle);

    // Create vector layer and add the marker
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [restaurantMarker] // Add restaurant marker
      })
    });

    // Add vector layer to the map
    this.map.addLayer(vectorLayer);
  }

  private setupMapEvents(): void {
    // Click event to show the popup
    this.map.on('click', (event) => {
      this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        const name = feature.get('name'); // Restaurant name
        this.content.innerHTML = `<p>${name}</p>`;
        this.overlay.setPosition(coordinates);
      });
    });

    // Hover event handling
    this.map.on('pointermove', (event) => {
      const pixel = this.map.getEventPixel(event.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);

      // Add hover effect
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
  }
}
