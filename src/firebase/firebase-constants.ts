/**
 * The Firebase Constants
 */
export const FirebaseConstants = {
    preferredCloudFunctionRegion: "europe-west3",
    collections: {
        countries: {
            name: "countries",
            cities: {
                name: "cities",
            },
            metrics: {
                name: "metrics",
            },
        },
        users: {
            name: "users",
            consumptions: {
                name: "consumptions",
            },
            consumptionSummaries: {
                name: "consumption-summaries",
            },
            recurringConsumptions: {
                name: "recurring-consumptions",
            },
        },
        exportUserDataBlacklistedUsers: {
            name: "_export-user-data-blacklisted-users",
        },
    },
    buckets: {
        auroraDashboard: {
            name: "aurora-dashboard",
            folders: {
                dashboardData: {
                    name: "dashboard-data",
                },
                countryData: {
                    name: "country-data",
                },
                userDataBackup: {
                    name: "user-data-backup",
                },
            },
        },
    },
};
