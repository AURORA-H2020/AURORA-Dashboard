import FormDatePicker from "@/components/formItems/formDatePicker";
import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import firebaseApp from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { consumptionSources } from "@/lib/constants";
import { heatingFormSchema } from "@/lib/zod/consumptionSchemas";
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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: consumption?.value || 0,
            category: "heating",
            heating: {
                heatingFuel: consumption?.heating?.heatingFuel || "naturalGas",
                districtHeatingSource:
                    consumption?.heating?.districtHeatingSource || "default",
                costs: consumption?.electricity?.costs || 0,
                householdSize: consumption?.electricity?.householdSize || 1,
                startDate:
                    consumption?.electricity?.startDate || Timestamp.now(),
                endDate: consumption?.electricity?.endDate || Timestamp.now(),
            },
            description: consumption?.description || "",
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
