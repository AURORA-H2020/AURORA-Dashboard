import FormDatePicker from "@/components/formItems/formDatePicker";
import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import FormTextField from "@/components/formItems/formTextField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { addEditConsumption } from "@/firebase/consumption/addEditConsumption";
import { consumptionSources } from "@/lib/constants";
import { cn } from "@/lib/utilities";
import { electricityFormSchema } from "@/lib/zod/consumptionSchemas";
import { ConsumptionWithID } from "@/models/extensions";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BorderBox from "../../common/borderBox";

const ElectricityForm = ({
    consumption,
    isDuplication,
    onConsumptionAdded,
    className,
}: {
    consumption?: ConsumptionWithID;
    isDuplication?: boolean;
    onConsumptionAdded?: (success: boolean) => void;
    className?: string;
}) => {
    const t = useTranslations();
    const formSchema = electricityFormSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const initialFormData: DefaultValues<Consumption> = {
        value: consumption?.value || undefined,
        category: "electricity",
        electricity: {
            electricitySource:
                consumption?.electricity?.electricitySource || undefined,
            costs: consumption?.electricity?.costs || undefined,
            householdSize: consumption?.electricity?.householdSize || 1,
            startDate: consumption?.electricity?.startDate || Timestamp.now(),
            endDate:
                consumption?.electricity?.endDate ||
                Timestamp.fromMillis(Timestamp.now().toMillis() + 172800000),
        },
        description: consumption?.description || undefined,
        createdAt: consumption?.createdAt || Timestamp.now(),
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormData,
    });

    const onSubmit = async (data: Consumption) => {
        const { success } = await addEditConsumption(
            data,
            "electricity",
            user,
            isDuplication ? undefined : consumption?.id,
        );
        if (success) {
            if (consumption?.id) {
                toast.success("Your consumption was updated successfully.");
            } else {
                toast.success("Your consumption was created successfully.");
            }
        } else {
            toast.error("There was an error creating your consumption.");
        }

        if (onConsumptionAdded) {
            onConsumptionAdded(success);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, "flex flex-col gap-4 w-full")}
            >
                <BorderBox>
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Consumption"
                                label="Consumption"
                                description="You can find this information on your electricity bill."
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="electricity.householdSize"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="People in household"
                                label="People in household"
                                description="How many people, including you, live in your household."
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="electricity.electricitySource"
                        render={({ field }) => (
                            <FormSelect
                                field={field}
                                options={consumptionSources.electricity.map(
                                    (source) => ({
                                        value: source.source,
                                        label: t(source.name),
                                    }),
                                )}
                                placeholder="Electricity Source"
                                label={"Electricity Source"}
                                description="Select the appropriate electricity source."
                            />
                        )}
                    />
                </BorderBox>

                <BorderBox>
                    <FormField
                        control={form.control}
                        name="electricity.startDate"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                label={"Start date"}
                                maxDate={form
                                    .watch("electricity.endDate")
                                    .toDate()}
                                description="Select the beginning and end of this consumption. You can find this information on your electricity bill."
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="electricity.endDate"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                label={"End date"}
                                minDate={form
                                    .watch("electricity.startDate")
                                    .toDate()}
                            />
                        )}
                    />
                </BorderBox>

                <BorderBox>
                    <FormField
                        control={form.control}
                        name="electricity.costs"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Costs"
                                label="Costs"
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormTextField
                                field={field}
                                placeholder="Description"
                                label="Description"
                                description="You may add a description to your entry to help you find it later."
                            />
                        )}
                    />
                </BorderBox>

                <DialogFooter className="flex sm:justify-between">
                    <Button type="submit">
                        {consumption
                            ? t("app.updateConsumption")
                            : t("app.addConsumption")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default ElectricityForm;
