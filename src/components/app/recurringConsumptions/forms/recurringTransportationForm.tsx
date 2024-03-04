import FormInputField from "@/components/formItems/formInputField";
import FormMultiSelect from "@/components/formItems/formMultiSelect";
import FormSelect from "@/components/formItems/formSelect";
import FormSwitch from "@/components/formItems/formSwitch";
import FormTextField from "@/components/formItems/formTextField";
import FormTimePicker from "@/components/formItems/formTimePicker";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { addEditRecurringConsumption } from "@/firebase/consumption/addEditRecurringConsumption";
import { weekdays } from "@/lib/constants/constants";
import {
    consumptionSources,
    privateVehicleTypes,
    publicVehicleOccupancies,
    publicVerhicleTypes,
    recurringConsumptionFrequencies,
} from "@/lib/constants/consumptions";
import { cn } from "@/lib/utilities";
import { recurringTransportationFormSchema } from "@/lib/zod/recurringConsumptionSchemas";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Strong } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BorderBox from "../../common/borderBox";

const RecurringTransportationForm = ({
    recurringConsumption,
    onFormSubmit,
    className,
}: {
    recurringConsumption?: RecurringConsumptionWithID;
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}) => {
    const t = useTranslations();
    const formSchema = recurringTransportationFormSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const initialFormData: DefaultValues<RecurringConsumption> = {
        createdAt: recurringConsumption?.createdAt || Timestamp.now(),
        isEnabled: recurringConsumption?.isEnabled ?? true,
        frequency: {
            unit: recurringConsumption?.frequency?.unit || "daily",
            weekdays: recurringConsumption?.frequency?.weekdays || undefined,
            dayOfMonth:
                recurringConsumption?.frequency?.dayOfMonth ?? undefined,
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
                recurringConsumption?.transportation?.hourOfTravel ??
                new Date().getHours(),
            minuteOfTravel:
                recurringConsumption?.transportation?.minuteOfTravel ??
                new Date().getMinutes(),
            distance:
                recurringConsumption?.transportation?.distance || undefined,
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

    const formFrequencyUnit = form.watch("frequency.unit");

    useEffect(() => {
        if (!privateVehicleTypes.includes(formTransportationType)) {
            form.setValue("transportation.privateVehicleOccupancy", undefined);
        }
        if (!publicVerhicleTypes.includes(formTransportationType)) {
            form.setValue("transportation.publicVehicleOccupancy", undefined);
        }
        if (formFrequencyUnit !== "weekly") {
            form.setValue("frequency.weekdays", undefined);
        }
        if (formFrequencyUnit !== "monthly") {
            form.setValue("frequency.dayOfMonth", undefined);
        }
    }, [formTransportationType, form, formFrequencyUnit]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, "flex flex-col gap-4 w-full")}
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

                <BorderBox>
                    <FormField
                        control={form.control}
                        name="frequency.unit"
                        render={({ field }) => (
                            <FormSelect
                                field={field}
                                options={recurringConsumptionFrequencies.map(
                                    (occupancy) => ({
                                        value: occupancy.key,
                                        label: t(occupancy.label),
                                    }),
                                )}
                                placeholder="Frequency"
                                label={"Frequency"}
                            />
                        )}
                    />

                    {formFrequencyUnit === "weekly" && (
                        <FormField
                            control={form.control}
                            name="frequency.weekdays"
                            render={({ field }) => (
                                <FormMultiSelect
                                    field={field}
                                    options={weekdays.map((occupancy) => ({
                                        value: occupancy.key.toString(),
                                        label: t(occupancy.label),
                                    }))}
                                    placeholder="Weekdays"
                                    label={"Weekdays"}
                                />
                            )}
                        />
                    )}

                    {formFrequencyUnit === "monthly" && (
                        <FormField
                            control={form.control}
                            name="frequency.dayOfMonth"
                            render={({ field }) => (
                                <FormInputField
                                    field={field}
                                    inputType="number"
                                    placeholder="Day of Month"
                                    label="Day of Month"
                                />
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="transportation.distance"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="number"
                                placeholder="Distance"
                                label="Distance"
                            />
                        )}
                    />
                </BorderBox>

                <BorderBox>
                    <Flex justify="between" align="center">
                        <FormLabel>Start of Travel</FormLabel>
                        <Flex justify="between" align="center" gap="8">
                            <FormField
                                control={form.control}
                                name="transportation.hourOfTravel"
                                render={({ field }) => (
                                    <FormTimePicker
                                        field={field}
                                        picker="hours"
                                    />
                                )}
                            />
                            <div className="mx-2">
                                <Strong>:</Strong>
                            </div>
                            <FormField
                                control={form.control}
                                name="transportation.minuteOfTravel"
                                render={({ field }) => (
                                    <FormTimePicker
                                        field={field}
                                        picker="minutes"
                                    />
                                )}
                            />
                        </Flex>
                    </Flex>

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
                                label={"Transportation Type"}
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
                                    label="Private Vehicle Occupancy"
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
                                    label={"Public Vehicle Occupancy"}
                                />
                            )}
                        />
                    )}
                </BorderBox>

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
                            ? t("app.updateRecurringConsumption")
                            : t("app.addRecurringConsumption")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default RecurringTransportationForm;
