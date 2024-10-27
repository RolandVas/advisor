import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('./core/pages/home/home.routes').then((r) => r.HOME_ROUTES),
        data: { preload: false}
    },
    {
        path: 'item',
        loadChildren: () => import('./core/pages/item/item.routes').then((r) => r.ITEM_ROUTES),
        data: { preload: false}
    },
    {
        path: 'add-item',
        loadChildren: () => import('./core/pages/add-new-item/add-new-item.routes').then((r) => r.NEWITEM_ROUTES),
        data: { preload: false}
    }
];
