import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { labelMappings } from "@/lib/constants/consumptions";
import { Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

/**
 * Renders a modal component that displays information about labels.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the modal trigger.
 * @return {React.ReactNode} The rendered modal component.
 */
const LabelInfoModal = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode => {
    const t = useTranslations();

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("dashboard.energylabels.title")}
                    </DialogTitle>
                    <DialogDescription>
                        <Text>{t("dashboard.energylabels.description")}</Text>
                    </DialogDescription>
                </DialogHeader>
                <Table className="mt-6">
                    <TableBody>
                        {labelMappings.map((label) => (
                            <TableRow key={label.label}>
                                <TableCell className="font-medium">
                                    <Badge
                                        className={`bg-[${label.color}] hover:bg-[${label.color}] text-white`}
                                    >
                                        {label.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>{t(label.name)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
};

export default LabelInfoModal;
