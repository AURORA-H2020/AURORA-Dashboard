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
import BorderBox from "../../common/borderBox";

const HeatingForm = ({
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
            costs: consumption?.heating?.costs || undefined,
            householdSize: consumption?.heating?.householdSize || 1,
            startDate: consumption?.heating?.startDate || Timestamp.now(),
            endDate:
                consumption?.heating?.endDate ||
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
            "heating",
            user,
            isDuplication ? undefined : consumption?.id,
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
                                description="You can find this information on your heating bill."
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
                                label="People in household"
                                description="How many people, including you, live in your household."
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
                                label={"Heating Fuel"}
                                description="Select your type of heating. You can find this information on your heating bill."
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
                                    label={"District Heating Source"}
                                />
                            )}
                        />
                    )}
                </BorderBox>

                <BorderBox>
                    <FormField
                        control={form.control}
                        name="heating.startDate"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                label={"Start date"}
                                maxDate={form.watch("heating.endDate").toDate()}
                                description="Select the beginning and end of this consumption. You can find this information on your heating bill."
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
                                label={"End date"}
                                minDate={form
                                    .watch("heating.startDate")
                                    .toDate()}
                            />
                        )}
                    />
                </BorderBox>

                <BorderBox>
                    <FormField
                        control={form.control}
                        name="heating.costs"
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

export default HeatingForm;
