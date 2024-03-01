"use client";

import PlaceholderCard from "@/components/app/common/placeholderCard";
import SimplePagination from "@/components/app/common/simplePagination";
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
import { usePaginatedRecurringConsumptions } from "@/firebase/firebaseHooks";
import { cn } from "@/lib/utilities";
import { Flex, Grid, Strong } from "@radix-ui/themes";
import BorderBox from "../common/borderBox";
import RecurringConsumptionPreview from "./recurringConsumptionPreview";

/**
 * Renders a list of Recurring Consumption components.
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
        recurringConsumptionPage,
        maxPage,
        currentPage,
        onOrderChange,
        orderBy,
        totalRecurringConsumptions,
    } = usePaginatedRecurringConsumptions({
        user: user,
        pageSize: 10,
    });

    if (!recurringConsumptionPage) {
        return <LoadingSpinner />;
    }

    if (recurringConsumptionPage.length < 1) {
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
                        <SelectItem value="frequency">Frequency</SelectItem>
                    </SelectContent>
                </Select>
            </Flex>
            {recurringConsumptionPage &&
                recurringConsumptionPage.map((recurringConsumption) => (
                    <RecurringConsumptionPreview
                        key={recurringConsumption.id}
                        recurringConsumption={recurringConsumption}
                    />
                ))}

            <SimplePagination
                currentPage={currentPage}
                maxPage={maxPage}
                fetchPreviousPage={fetchPreviousPage}
                fetchNextPage={fetchNextPage}
            />
            {totalRecurringConsumptions > 0 && (
                <BorderBox>
                    <p>
                        Total recurring consumptions:{" "}
                        <Strong>{totalRecurringConsumptions}</Strong>
                    </p>
                </BorderBox>
            )}
        </Grid>
    );
};

export default ConsumptionList;
