export const accountFixture = {
    name: "Cash money",
    type: "Cash",
    currency: "EUR",
    description: "description",
    id: "customid1"
}

export const paymentFixture = {
    payeeName: "Jumbo",
    paymentCategory: "Groceries",
    amount: 2000,
    accountid: accountFixture.id,
    description: "Eggs, milk and chocolate."
}