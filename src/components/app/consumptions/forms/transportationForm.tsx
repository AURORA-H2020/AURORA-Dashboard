import FormDatePicker from "@/components/formItems/formDatePicker";
import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import FormTextField from "@/components/formItems/formTextField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { addEditConsumption } from "@/firebase/consumption/addEditConsumption";
import {
    consumptionSources,
    privateVehicleTypes,
    publicVehicleOccupancies,
    publicVerhicleTypes,
} from "@/lib/constants";
import { cn } from "@/lib/utilities";
import { transportationFormSchema } from "@/lib/zod/consumptionSchemas";
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

const TransportationForm = ({
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
    const formSchema = transportationFormSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const initialFormData: DefaultValues<Consumption> = {
        value: consumption?.value || undefined,
        category: "transportation",
        transportation: {
            transportationType:
                consumption?.transportation?.transportationType || undefined,
            privateVehicleOccupancy:
                consumption?.transportation?.privateVehicleOccupancy ||
                undefined,
            publicVehicleOccupancy:
                consumption?.transportation?.publicVehicleOccupancy ||
                undefined,
            dateOfTravel:
                consumption?.transportation?.dateOfTravel || Timestamp.now(),
            dateOfTravelEnd:
                consumption?.transportation?.dateOfTravelEnd || undefined,
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
            "transportation",
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

                <BorderBox>
                    <FormField
                        control={form.control}
                        name="transportation.dateOfTravel"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                label={"Start date"}
                                showTimePicker={true}
                                maxDate={
                                    form
                                        .watch("transportation.dateOfTravelEnd")
                                        ?.toDate() || undefined
                                }
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="transportation.dateOfTravelEnd"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                label={"End date"}
                                showTimePicker={true}
                                showClearButton={true}
                                minDate={form
                                    .watch("transportation.dateOfTravel")
                                    .toDate()}
                            />
                        )}
                    />
                </BorderBox>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormTextField
                            field={field}
                            placeholder="Description"
                            label="Description"
                            description="You may add a description to your consumption to help you find it later."
                        />
                    )}
                />

                <DialogFooter className="flex sm:justify-between">
                    <Button type="submit">
                        {consumption && !isDuplication
                            ? t("app.updateConsumption")
                            : t("app.addConsumption")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default TransportationForm;
