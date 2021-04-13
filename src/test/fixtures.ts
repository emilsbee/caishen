export const accountFixture = {
    valid: {
        name: "Cash money",
        type: "Cash",
        currency: "EUR",
        description: "description",
        id: "1a43b7e0-9c7b-11eb-a8b3-0242ac130003"
    },
    valid2: {
        name: "Cash money 2",
        type: "Cash",
        currency: "EUR",
        description: "description",
        id: "1a43b7e0-9c7b-11eb-a8b3-0242ac130002"
    },
    noName: {
        type: "Cash",
        currency: "EUR",
        description: "description",
        id: "1a43b7e0-9c7b-11eb-a8b3-0242ac130003"
    },
    noType: {
        name: "Cash money",
        currency: "EUR",
        description: "description",
        id: "1a43b7e0-9c7b-11eb-a8b3-0242ac130003"
    },
    invalidType: {
        name: "Cash money",
        type: "faketype",
        currency: "EUR",
        description: "description",
        id: "1a43b7e0-9c7b-11eb-a8b3-0242ac130003"
    },
    noCurrency: {
        name: "Cash money",
        type: "Cash",
        description: "description",
        id: "1a43b7e0-9c7b-11eb-a8b3-0242ac130003"
    }, 
    invalidCurrency: {
        name: "Cash money",
        type: "Cash",
        currency: "fakecur",
        description: "description",
        id: "1a43b7e0-9c7b-11eb-a8b3-0242ac130003"
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