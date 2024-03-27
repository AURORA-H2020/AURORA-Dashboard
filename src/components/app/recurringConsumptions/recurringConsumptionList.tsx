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
import { useTranslations } from "next-intl";
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
    const t = useTranslations();
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
        return (
            <PlaceholderCard>
                {t("error.noRecurringConsumptionsFound")}
            </PlaceholderCard>
        );
    }
    return (
        <Grid gap="4" className={cn(className)}>
            <Flex direction="column" gap="2">
                <Label htmlFor="order-by">{t("app.filter.orderBy")}</Label>
                <Select onValueChange={onOrderChange} value={orderBy}>
                    <SelectTrigger id="order-by" className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">
                            {t("app.form.createdAt")}
                        </SelectItem>
                        <SelectItem value="frequency">
                            {t("app.form.frequency")}
                        </SelectItem>
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
                        {t("app.totalRecurringConsumptions")}
                        {": "}
                        <Strong>{totalRecurringConsumptions}</Strong>
                    </p>
                </BorderBox>
            )}
        </Grid>
    );
};

export default ConsumptionList;
