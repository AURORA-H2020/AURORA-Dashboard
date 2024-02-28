import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import FormSwitch from "@/components/formItems/formSwitch";
import FormTextField from "@/components/formItems/formTextField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { addEditRecurringConsumption } from "@/firebase/consumption/addEditRecurringConsumption";
import {
    consumptionSources,
    privateVehicleTypes,
    publicVehicleOccupancies,
    publicVerhicleTypes,
} from "@/lib/constants";
import { cn } from "@/lib/utilities";
import { recurringTransportationFormSchema } from "@/lib/zod/recurringConsumptionSchemas";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function RecurringTransportationForm({
    recurringConsumption,
    onFormSubmit,
    className,
}: {
    recurringConsumption?: RecurringConsumptionWithID;
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}) {
    const t = useTranslations();
    const formSchema = recurringTransportationFormSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const initialFormData: DefaultValues<RecurringConsumption> = {
        createdAt: Timestamp.now(),
        isEnabled: recurringConsumption?.isEnabled ?? true,
        frequency: {
            unit: recurringConsumption?.frequency?.unit || "weekly",
            weekdays: recurringConsumption?.frequency?.weekdays || [0, 1],
            dayOfMonth: recurringConsumption?.frequency?.dayOfMonth ?? 1,
        },
        category: "transportation",
        transportation: {
            transportationType:
                recurringConsumption?.transportation?.transportationType ||
                undefined,
            privateVehicleOccupancy:
                recurringConsumption?.transportation?.privateVehicleOccupancy ||
                undefined,
            publicVehicleOccupancy:
                recurringConsumption?.transportation?.publicVehicleOccupancy ||
                undefined,
            hourOfTravel:
                recurringConsumption?.transportation?.hourOfTravel ?? 1,
            minuteOfTravel:
                recurringConsumption?.transportation?.minuteOfTravel ?? 1,
            distance: recurringConsumption?.transportation?.distance || 1,
        },
        description: recurringConsumption?.description || "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormData,
    });

    const onSubmit = async (data: RecurringConsumption) => {
        const { success } = await addEditRecurringConsumption(
            data,
            "transportation",
            user,
            recurringConsumption?.id,
        );
        if (success) {
            if (recurringConsumption?.id) {
                toast.success("Your consumption was updated successfully.");
            } else {
                toast.success("Your consumption was created successfully.");
            }
        } else {
            toast.error("There was an error creating your consumption.");
        }

        if (onFormSubmit) {
            onFormSubmit(success);
        }
    };

    const formTransportationType = form.watch(
        "transportation.transportationType",
    );

    useEffect(() => {
        if (!privateVehicleTypes.includes(formTransportationType)) {
            form.setValue("transportation.privateVehicleOccupancy", undefined);
        }
        if (!publicVerhicleTypes.includes(formTransportationType)) {
            form.setValue("transportation.publicVehicleOccupancy", undefined);
        }
    }, [formTransportationType, form]);

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(className, "flex flex-col gap-4 w-full mt-4")}
                >
                    <FormField
                        control={form.control}
                        name="isEnabled"
                        render={({ field }) => (
                            <FormSwitch
                                field={field}
                                label="Enabled"
                                description="Turn this off to stop tracking this consumption."
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="transportation.distance"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Distance"
                                formLabel="Distance"
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="transportation.hourOfTravel"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Hour of travel"
                                formLabel="Hour of travel"
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="transportation.minuteOfTravel"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Minute of travel"
                                formLabel="Minute of travel"
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="transportation.transportationType"
                        render={({ field }) => (
                            <FormSelect
                                field={field}
                                options={consumptionSources.transportation.map(
                                    (source) => ({
                                        value: source.source,
                                        label: t(source.name),
                                    }),
                                )}
                                placeholder="Transportation Type"
                                formLabel={"Transportation Type"}
                            />
                        )}
                    />

                    {privateVehicleTypes.includes(formTransportationType) && (
                        <FormField
                            control={form.control}
                            name="transportation.privateVehicleOccupancy"
                            render={({ field }) => (
                                <FormInputField
                                    field={field}
                                    inputType="number"
                                    placeholder="Private Vehicle Occupancy"
                                    formLabel="Private Vehicle Occupancy"
                                />
                            )}
                        />
                    )}

                    {publicVerhicleTypes.includes(formTransportationType) && (
                        <FormField
                            control={form.control}
                            name="transportation.publicVehicleOccupancy"
                            render={({ field }) => (
                                <FormSelect
                                    field={field}
                                    options={publicVehicleOccupancies.map(
                                        (occupancy) => ({
                                            value: occupancy.key,
                                            label: t(occupancy.label),
                                        }),
                                    )}
                                    placeholder="Public Vehicle Occupancy"
                                    formLabel={"Public Vehicle Occupancy"}
                                />
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormTextField
                                field={field}
                                placeholder="Description"
                                label="Description"
                            />
                        )}
                    />

                    <DialogFooter className="flex sm:justify-between">
                        <Button type="submit">
                            {recurringConsumption
                                ? t("app.updateConsumption")
                                : t("app.addConsumption")}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
}
