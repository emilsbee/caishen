export const accountFixture = {
    valid: {
        name: "Cash money",
        type: "Cash",
        currency: "EUR",
        description: "description",
        id: "customid1"
    },
    noName: {
        type: "Cash",
        currency: "EUR",
        description: "description",
        id: "customid1"
    },
    noType: {
        name: "Cash money",
        currency: "EUR",
        description: "description",
        id: "customid1"
    },
    invalidType: {
        name: "Cash money",
        type: "faketype",
        currency: "EUR",
        description: "description",
        id: "customid1"
    },
    noCurrency: {
        name: "Cash money",
        type: "Cash",
        description: "description",
        id: "customid1"
    }, 
    invalidCurrency: {
        name: "Cash money",
        type: "Cash",
        currency: "fakecur",
        description: "description",
        id: "customid1"
    }
}

export const paymentFixture = {
    valid: {
        payeeName: "Jumbo",
        paymentCategory: "Groceries",
        amount: 2000,
        accountid: accountFixture.valid.id,
        description: "Eggs, milk and chocolate."
    },
    invalidAccountid: {
        payeeName: "Jumbo",
        paymentCategory: "Groceries",
        amount: 2000,
        accountid: "fakeid",
        description: "Eggs, milk and chocolate."
    }
}