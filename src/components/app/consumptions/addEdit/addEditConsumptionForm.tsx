import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import firebaseApp from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { consumptionSources } from "@/lib/constants";
import { cn } from "@/lib/utilities";
import { ElectricityFormSchema } from "@/lib/zod/consumptionSchemas";
import { ConsumptionWithID } from "@/models/extensions";
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
import { CalendarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export default function AddEditConsumptionForm({
    consumption,
    onConsumptionAdded,
}: {
    consumption?: ConsumptionWithID;
    onConsumptionAdded?: (success: boolean) => void;
}) {
    const t = useTranslations();
    const format = useFormatter();

    const { user } = useAuthContext() as {
        user: User;
    };

    const form = useForm<z.infer<typeof ElectricityFormSchema>>({
        resolver: zodResolver(ElectricityFormSchema),
        defaultValues: {
            value: consumption?.value || 100,
            category: "electricity",
            electricity: {
                electricitySource:
                    consumption?.electricity?.electricitySource || "default",
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

    const onSubmit = async (data) => {
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
        return <p>Please log in to update your profile.</p>;
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Consumption</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Consumption"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="electricity.householdSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>People in household</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="People in household"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="electricity.electricitySource"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Electricity Source</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Electricity Source" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {consumptionSources.electricity.map(
                                            (source) => (
                                                <SelectItem
                                                    key={source.source}
                                                    value={source.source}
                                                >
                                                    {t(source.name)}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="electricity.startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground",
                                                )}
                                            >
                                                {field.value ? (
                                                    format.dateTime(
                                                        field.value.toDate(),
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value.toDate()}
                                            onSelect={(date) => {
                                                const timestamp =
                                                    Timestamp.fromDate(
                                                        date || new Date(),
                                                    );
                                                field.onChange(timestamp);
                                            }}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="electricity.endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground",
                                                )}
                                            >
                                                {field.value ? (
                                                    format.dateTime(
                                                        field.value.toDate(),
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value.toDate()}
                                            onSelect={(date) => {
                                                const timestamp =
                                                    Timestamp.fromDate(
                                                        date || new Date(),
                                                    );
                                                field.onChange(timestamp);
                                            }}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="electricity.costs"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Costs</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Costs"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
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
