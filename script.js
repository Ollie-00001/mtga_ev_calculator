// Event rewards and costs for MTGA events
// This data is used to calculate the expected value (EV) of participating in different MTGA
const eventData = {
            premier: {
                name: "Premier Draft",
                cost: 1500,
                currency: "gems",
                rewards: {
                    0: { gems: 50, packs: 1 },
                    1: { gems: 100, packs: 1 },
                    2: { gems: 250, packs: 2 },
                    3: { gems: 1000, packs: 2 },
                    4: { gems: 1400, packs: 3 },
                    5: { gems: 1600, packs: 4 },
                    6: { gems: 1800, packs: 5 },
                    7: { gems: 2200, packs: 6 }
                },
                maxWins: 7,
                maxLosses: 3
            },
            traditional: {
                name: "Traditional Draft",
                cost: 1500,
                currency: "gems",
                rewards: {
                    0: { gems: 0, packs: 1 },
                    1: { gems: 1000, packs: 1 },
                    2: { gems: 1700, packs: 4 },
                    3: { gems: 2500, packs: 6 }
                },
                maxWins: 3,
                maxLosses: 1
            },
            quick: {
                name: "Quick Draft",
                cost: 750,
                currency: "gems",
                rewards: {
                    0: { gems: 50, packs: 1.2 },
                    1: { gems: 100, packs: 1.22 },
                    2: { gems: 200, packs: 1.24 },
                    3: { gems: 300, packs: 1.26 },
                    4: { gems: 450, packs: 1.3 },
                    5: { gems: 650, packs: 1.35 },
                    6: { gems: 850, packs: 1.4 },
                    7: { gems: 950, packs: 2 }
                },
                maxWins: 7,
                maxLosses: 3
            },
            sealed: {
                name: "Sealed",
                cost: 2000,
                currency: "gems",
                rewards: {
                    0: { gems: 200, packs: 3 },
                    1: { gems: 400, packs: 3 },
                    2: { gems: 600, packs: 3 },
                    3: { gems: 1200, packs: 3 },
                    4: { gems: 1400, packs: 4 },
                    5: { gems: 1600, packs: 5 },
                    6: { gems: 1800, packs: 6 },
                    7: { gems: 2200, packs: 6 }
                },
                maxWins: 7,
                maxLosses: 3
            }
        };
