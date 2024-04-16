import BorderBox from "@/components/app/common/borderBox";
import FormDatePicker from "@/components/formItems/formDatePicker";
import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import FormTextField from "@/components/formItems/formTextField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { addEditConsumption } from "@/firebase/consumption/addEditConsumption";
import { consumptionSources } from "@/lib/constants/consumptions";
import { cn } from "@/lib/utilities";
import { electricityFormSchema } from "@/lib/zod/consumptionSchemas";
import { ConsumptionWithID } from "@/models/extensions";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
            electricityExported:
                consumption?.electricity?.electricityExported || undefined,
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

    const formElectricitySource = form.watch("electricity.electricitySource");

    useEffect(() => {
        if (formElectricitySource !== "homePhotovoltaics") {
            form.setValue("electricity.electricityExported", undefined);
        }
    }, [formElectricitySource, form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, "flex flex-col gap-4 w-full")}
            >
                <BorderBox>
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
                                placeholder={t(
                                    "app.form.electricity.electricitySource",
                                )}
                                label={t(
                                    "app.form.electricity.electricitySource",
                                )}
                                description={t(
                                    "app.form.electricity.electricitySourceDescription",
                                )}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder={t("app.consumption")}
                                unit="kWh"
                                label={
                                    formElectricitySource ===
                                    "homePhotovoltaics"
                                        ? t(
                                              "app.form.electricity.energyProduced",
                                          )
                                        : t("app.consumption")
                                }
                                description={
                                    formElectricitySource ===
                                    "homePhotovoltaics"
                                        ? t(
                                              "app.form.electricity.pvProductionDescription",
                                          )
                                        : t(
                                              "app.form.electricity.energyBillDescription",
                                          )
                                }
                            />
                        )}
                    />
                    {formElectricitySource === "homePhotovoltaics" && (
                        <FormField
                            control={form.control}
                            name="electricity.electricityExported"
                            render={({ field }) => (
                                <FormInputField
                                    field={field}
                                    inputType="number"
                                    placeholder={t(
                                        "app.form.electricity.energyExported",
                                    )}
                                    unit="kWh"
                                    label={t(
                                        "app.form.electricity.gridExported",
                                    )}
                                    showSwitch={true}
                                />
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="electricity.householdSize"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder={t("app.form.peopleInHousehold")}
                                label={t("app.form.peopleInHousehold")}
                                description={t(
                                    "app.form.peopleInHouseholdDescription",
                                )}
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
                                label={t("ui.monthPicker.start")}
                                maxDate={form
                                    .watch("electricity.endDate")
                                    .toDate()}
                                description={t(
                                    "app.form.electricity.dateSelectDescription",
                                )}
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
                                label={t("ui.monthPicker.end")}
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
                                placeholder={t("app.form.costs")}
                                label={t("app.form.costs")}
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormTextField
                                field={field}
                                placeholder={t("app.form.description")}
                                label={t("app.form.description")}
                                description={t("app.form.descriptionHelpText")}
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
