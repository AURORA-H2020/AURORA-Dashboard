import FormDatePicker from "@/components/formItems/formDatePicker";
import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import firebaseApp from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { consumptionSources, publicVehicleOccupancies } from "@/lib/constants";
import { transportationFormSchema } from "@/lib/zod/consumptionSchemas";
import { ConsumptionWithID } from "@/models/extensions";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import {
    Timestamp,
    addDoc,
    collection,
    doc,
    getFirestore,
    setDoc,
} from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export default function TransportationForm({
    consumption,
    onConsumptionAdded,
}: {
    consumption?: ConsumptionWithID;
    onConsumptionAdded?: (success: boolean) => void;
}) {
    const t = useTranslations();
    const formSchema = transportationFormSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: consumption?.value || undefined,
            category: "transportation",
            transportation: {
                transportationType:
                    consumption?.transportation?.transportationType ||
                    undefined,
                privateVehicleOccupancy:
                    consumption?.transportation?.privateVehicleOccupancy || 1,
                publicVehicleOccupancy:
                    consumption?.transportation?.publicVehicleOccupancy ||
                    undefined,
                dateOfTravel:
                    consumption?.electricity?.startDate || Timestamp.now(),
                dateOfTravelEnd: consumption?.electricity?.endDate || undefined,
            },
            description: consumption?.description || undefined,
            createdAt: Timestamp.now(),
        },
    });

    const onSubmit = async (data: Consumption) => {
        let success = false;
        if (user) {
            const consumptionRef = collection(
                firestore,
                FirebaseConstants.collections.users.name,
                user.uid,
                FirebaseConstants.collections.users.consumptions.name,
            );
            try {
                if (consumption?.id) {
                    const docRef = doc(consumptionRef, consumption.id);
                    await setDoc(docRef, data);
                    toast.success("Your consumption was updated successfully.");
                } else {
                    await addDoc(consumptionRef, data);
                    toast.success("Your consumption was created successfully.");
                }
                success = true;
            } catch (error) {
                console.error("Error writing document: ", error);
                toast.success("There was an error creating your consumption.");
            }
        } else {
            toast.success("Please login to add a consumption.");
        }
        if (onConsumptionAdded) {
            onConsumptionAdded(success);
        }
    };

    if (!user) {
        return;
    }

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

                    <FormField
                        control={form.control}
                        name="transportation.dateOfTravel"
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
                        name="transportation.dateOfTravelEnd"
                        render={({ field }) => (
                            <FormDatePicker
                                field={field}
                                placeholder={t("common.placeholder.selectDate")}
                                formLabel={"End date"}
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
