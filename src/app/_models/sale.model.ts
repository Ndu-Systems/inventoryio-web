export interface SellModel {
    items: Item[];
    total: number;
}

export interface Item {
    prodcuId: string;
    name: string;
    price: number;
    subTotal?: number;
    quantity: number;
};
