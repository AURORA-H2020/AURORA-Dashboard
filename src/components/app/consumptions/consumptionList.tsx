"use client";

import PlaceholderCard from "@/components/app/common/placeholderCard";
import SimplePagination from "@/components/app/common/simplePagination";
import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { usePaginatedConsumptions } from "@/firebase/firebaseHooks";
import { cn } from "@/lib/utilities";
import { Flex, Grid, Strong } from "@radix-ui/themes";
import BorderBox from "../common/borderBox";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {JSX.Element} The consumption list component.
 */
const ConsumptionList = ({
    className,
}: {
    className?: string;
}): JSX.Element => {
    const { user } = useAuthContext();

    const {
        fetchNextPage,
        fetchPreviousPage,
        consumptionPage,
        maxPage,
        currentPage,
        onOrderChange,
        orderBy,
        totalConsumptions,
    } = usePaginatedConsumptions({
        user: user,
        pageSize: 10,
    });

    if (!consumptionPage) {
        return <LoadingSpinner />;
    }

    if (consumptionPage.length < 1) {
        return <PlaceholderCard>No consumptions found.</PlaceholderCard>;
    }
    return (
        <Grid gap="4" className={cn(className)}>
            <Flex direction="column" gap="2">
                <Label htmlFor="order-by">Order by</Label>
                <Select onValueChange={onOrderChange} value={orderBy}>
                    <SelectTrigger id="order-by" className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Created At</SelectItem>
                        <SelectItem value="value">Value</SelectItem>
                    </SelectContent>
                </Select>
            </Flex>
            {consumptionPage &&
                consumptionPage.map((consumption) => (
                    <ConsumptionPreview
                        key={consumption.id}
                        consumption={consumption}
                    />
                ))}

            <SimplePagination
                currentPage={currentPage}
                maxPage={maxPage}
                fetchPreviousPage={fetchPreviousPage}
                fetchNextPage={fetchNextPage}
            />
            {totalConsumptions > 0 && (
                <BorderBox>
                    <p>
                        Total consumptions: <Strong>{totalConsumptions}</Strong>
                    </p>
                </BorderBox>
            )}
        </Grid>
    );
};

export default ConsumptionList;
