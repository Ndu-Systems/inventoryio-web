export interface SellModel {
    items: Item[];
    total: number;
}

export interface Item {
    name: string;
    price: number;
    sub?: number;
    quantity: number;
}