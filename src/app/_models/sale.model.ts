export interface SellModel {
    items: Item[];
    total: number;
}

export interface Item {
    prodcuId: string;
    name: string;
    image?: string;
    price: number;
    subTotal?: number;
    quantity: number;
    itemOptions?: ItemOptions[];

    // options

}

export interface ItemOptions {
    optionId: string;
    optionName: string;
    valueId: number;
    value: any;
}

