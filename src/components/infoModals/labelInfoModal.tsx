import { labelMappings } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

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
