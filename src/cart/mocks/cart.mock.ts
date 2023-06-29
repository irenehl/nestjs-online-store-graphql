export const cartMock = {
    id: 2,
    userId: 1,
    products: [
        {
            product: {
                SKU: 1,
                name: 'product 1',
                description: 'lorem ipsum',
                price: 12.3,
                stock: 3,
                image: null,
                available: true,
                category: 'LOREM',
            },
            quantity: 2,
        },
    ],
};

export const emptyCartMock = {
    id: 2,
    userId: 1,
    products: [],
};

export const productsOnCartsMock = {
    product: {
        SKU: 1,
        name: 'product 1',
        description: 'lorem ipsum',
        price: 12.3,
        stock: 3,
        image: null,
        available: true,
        category: 'LOREM',
    },
    quantity: 2,
    productSKU: 1,
    cartId: 1,
};

export const addProductToCartMock = {
    SKU: 1,
    quantity: 1,
};
