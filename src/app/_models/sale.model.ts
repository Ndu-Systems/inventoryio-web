export interface SellModel {
    items: Item[];
    total: number;
}

export interface Item {
    name: string;
    price: number;
    quantity: number;
}