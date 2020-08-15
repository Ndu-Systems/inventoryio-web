export interface ProductAvailabilityModel {
    Name: string;
    Class?: string[];
    Code: string;
}


export const ProductAvailabilityTypes: ProductAvailabilityModel[] = [
    {
        Name: 'In stock',
        Code: 'stock',
        Class: ['head-item', 'active']
    },
    {
        Name: 'I create/ stock on order',
        Code: 'make',
        Class: ['head-item']
    }
];
