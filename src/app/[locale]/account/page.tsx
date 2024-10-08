import { ConsumptionPanel } from "@/components/app/consumptionPanel";
import { ConsumptionSummaryPanel } from "@/components/app/consumptionSummaryPanel";
import { ConfirmUnitSystem } from "@/components/app/user/confirmUnitSystem";
import { Grid } from "@radix-ui/themes";

/**
 * Renders the account page for authenticated users, displaying user details
 * and a list of their consumptions. Redirects to the home page if the user
 * is not authenticated. It fetches user consumption data from Firestore.
 *
 * @return {React.ReactNode} The account page component with user information and a list of Consumption components.
 */
const AccountPage = (): React.ReactNode => {
    return (
        <>
            <ConfirmUnitSystem />
            <Grid
                columns={{ initial: "1", md: "2" }}
                gap="8"
                className="mt-8"
                align="start"
            >
                <ConsumptionSummaryPanel />

                <ConsumptionPanel />
            </Grid>
        </>
    );
};

export default AccountPage;
