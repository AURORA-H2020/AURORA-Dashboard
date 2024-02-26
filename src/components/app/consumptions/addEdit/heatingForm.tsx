import FormDatePicker from "@/components/formItems/formDatePicker";
import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { addEditConsumption } from "@/firebase/consumptions/addEditConsumption";
import { consumptionSources } from "@/lib/constants";
import { heatingFormSchema } from "@/lib/zod/consumptionSchemas";
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

export default function HeatingForm({
    consumption,
    onConsumptionAdded,
}: {
    consumption?: ConsumptionWithID;
    onConsumptionAdded?: (success: boolean) => void;
}) {
    const t = useTranslations();
    const formSchema = heatingFormSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const initialFormData: DefaultValues<Consumption> = {
        value: consumption?.value || undefined,
        category: "heating",
        heating: {
            heatingFuel: consumption?.heating?.heatingFuel,
            districtHeatingSource:
                consumption?.heating?.districtHeatingSource || undefined,
            costs: consumption?.electricity?.costs || undefined,
            householdSize: consumption?.electricity?.householdSize || 1,
            startDate: consumption?.electricity?.startDate || Timestamp.now(),
            endDate: consumption?.electricity?.endDate || Timestamp.now(),
        },
        description: consumption?.description || undefined,
        createdAt: Timestamp.now(),
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormData,
    });

    const onSubmit = async (data: Consumption) => {
        const { success } = await addEditConsumption(
            data,
            "transportation",
            user,
            consumption?.id,
        );
        if (consumption?.id) {
            if (success) {
                toast.success(t("toast.consumption.updatedSuccessfully"));
            } else toast.error(t("toast.consumption.updatedError"));
        } else {
            if (success) {
                toast.success(t("toast.consumption.addedSuccessfully"));
            } else toast.error(t("toast.consumption.addedError"));
        }

        if (onConsumptionAdded) {
            onConsumptionAdded(success);
        }
    };

    const formHeatingFuel = form.watch("heating.heatingFuel");

    useEffect(() => {
        if (formHeatingFuel !== "district") {
            form.setValue("heating.districtHeatingSource", undefined);
        }
    }, [formHeatingFuel, form]);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Consumption"
                                formLabel="Consumption"
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="heating.householdSize"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="People in household"
                                formLabel="People in household"
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="heating.heatingFuel"
                        render={({ field }) => (
                            <FormSelect
                                field={field}
                                options={consumptionSources.heating.map(
                                    (source) => ({
                                        value: source.source,
                                        label: t(source.name),
                                    }),
                                )}
                                placeholder="Heating Fuel"
                                formLabel={"Heating Fuel"}
                            />
                        )}
                    />

                    {formHeatingFuel === "district" && (
                        <FormField
                            control={form.control}
                            name="heating.districtHeatingSource"
                            render={({ field }) => (
                                <FormSelect
                                    field={field}
                                    options={consumptionSources.districtHeating.map(
                                        (source) => ({
                                            value: source.source,
                                            label: t(source.name),
                                        }),
                                    )}
                                    placeholder="District Heating Source"
                                    formLabel={"District Heating Source"}
                                />
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="heating.startDate"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                formLabel={"Start date"}
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="heating.endDate"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                formLabel={"End date"}
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="heating.costs"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Costs"
                                formLabel="Costs"
                            />
                        )}
                    />

                    <DialogFooter className="flex sm:justify-between">
                        <Button type="submit">
                            {consumption
                                ? t("app.updateConsumption")
                                : t("app.addConsumption")}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
}
