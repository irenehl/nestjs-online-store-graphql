export const orderMock = {
    id: 1,
    orderedAt: new Date('2023-06-14T01:19:25.182Z'),
    total: 24.6,
    userId: 10,
};

export const allOrdersMock = [
    {
        id: 1,
        orderedAt: new Date('2023-06-14T01:19:25.182Z'),
        total: 24.6,
        userId: 12,
    },
    {
        id: 2,
        orderedAt: new Date('2023-06-14T01:20:17.491Z'),
        total: 12.3,
        userId: 12,
    },
    {
        id: 3,
        orderedAt: new Date('2023-06-14T01:29:32.753Z'),
        total: 12.3,
        userId: 12,
    },
];

export const productsOnOrdersMock = {
    quantity: 2,
    productSKU: 1,
    cartId: 1,
    orderId: 1,
};

export const failProductsOnOrdersMock = {
    quantity: 2,
    productSKU: 1,
    cartId: 3,
    orderId: 1,
};

export const failOrderMock = {
    id: 1,
    orderedAt: new Date('2023-06-14T01:19:25.182Z'),
    total: 0,
    userId: 10,
};
