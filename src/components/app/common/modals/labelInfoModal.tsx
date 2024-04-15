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
import { useTranslations } from "next-intl";

const LabelInfoModal = ({ children }: { children: React.ReactNode }) => {
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
                        {t("dashboard.energylabels.description")}
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
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default LabelInfoModal;
