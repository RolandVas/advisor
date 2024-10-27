export interface Item {
    title: string,
    description?: string,
    category: ItemCategory,
    freeFrom: ItemFreeFrom,
    socialMedial?: SocialMedia,
    opening?: ItemOpening,
    address: ItemAddress
    id: string
}

export interface SocialMedia {
    facebook?: string,
    instagram?: string,
    tiktok?: string,
    homePage?: string,
}

export interface ItemFreeFrom {
    glutenFree?: boolean,
    vegan?: boolean,
    lactoseFree?: boolean,
}

export interface ItemCategory {
    src: string,
    label: string
    key: string
}

export interface ItemOpening {
    monday?: string,
    tuesday?: string,
    wednesday?: string,
    thursday?: string,
    friday?: string,
    saturday?: string,
    sunday?: string,
}

export interface ItemAddress {
    country: string,
    city: string,
    address: string,
    lat: string,
    lon: string
}

export enum ItemCategoryKey {
    RESTAURANT = 'restaurant',
    HOTEL = 'hotel',
    CAKE = 'cake',
    SHOP = 'shop'
}