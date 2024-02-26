import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";

// Props when `merged` is not provided or false.
interface ConsumptionTableRowPropsWithoutMerged {
    label: string;
    children: React.ReactNode;
    merged?: false;
}

// Props when `merged` is true, without the `label`.
interface ConsumptionTableRowPropsWithMerged {
    children: React.ReactNode;
    merged: true;
}

// Union type of both props scenarios.
type ConsumptionTableRowProps =
    | ConsumptionTableRowPropsWithoutMerged
    | ConsumptionTableRowPropsWithMerged;

/**
 * Renders a table row for consumption data with optional
 * merging of cells.
 *
 * @param {ConsumptionTableRowProps} props - Object with
 * children elements, merge flag, and optional label.
 * @return {JSX.Element} A table row element for consumption
 * data.
 */
export default function ConsumptionTableRow(
    props: ConsumptionTableRowProps,
): JSX.Element {
    const { children, merged } = props;
    const label = merged ? null : props.label; // label is ignored if merged is true

    return (
        <TableRow>
            {label && (
                <TableCell className="font-bold w-[40%]">{label}</TableCell>
            )}
            <TableCell
                colSpan={merged ? 2 : 1}
                className={merged ? "text-center" : ""}
            >
                {children}
            </TableCell>
        </TableRow>
    );
}
