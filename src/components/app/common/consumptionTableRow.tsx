import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utilities";
import { ReactNode } from "react";

// Props when `merged` is not provided or false.
interface ConsumptionTableRowPropsWithoutMerged {
  label: string | ReactNode;
  children: ReactNode;
  merged?: false;
  className?: string;
}

// Props when `merged` is true, without the `label`.
interface ConsumptionTableRowPropsWithMerged {
  children: ReactNode;
  merged: true;
  className?: string;
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
 * @return {ReactNode} A table row element for consumption
 * data.
 */
const ConsumptionTableRow = (props: ConsumptionTableRowProps): ReactNode => {
  const { children, merged, className } = props;
  const label = merged ? null : props.label; // label is ignored if merged is true

  return (
    <TableRow className={cn(className)}>
      {label && <TableCell className="font-bold w-[40%]">{label}</TableCell>}
      <TableCell
        colSpan={merged ? 2 : 1}
        className={merged ? "text-center" : ""}
      >
        {children}
      </TableCell>
    </TableRow>
  );
};

export { ConsumptionTableRow };
