import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import firebaseApp from "@/firebase/config";
import {
    citiesMapping,
    countriesMapping,
    genderMappings,
    homeEnergyLabels,
    householdProfiles,
} from "@/lib/constants";
import { cn } from "@/lib/utilities";
import { userDataFormSchema } from "@/lib/zod/userSchema";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

export default function UserDataForm({
    userData,
    onFormSubmit,
    isNewUser = false,
    className,
}: {
    userData?: FirebaseUser | null;
    onFormSubmit?: (success: boolean) => void;
    isNewUser?: boolean;
    className?: string;
}) {
    const t = useTranslations();
    const formSchema = userDataFormSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const initialFormData: DefaultValues<FirebaseUser> = {
        firstName: userData?.firstName || undefined,
        lastName: userData?.lastName || undefined,
        yearOfBirth: userData?.yearOfBirth || undefined,
        gender: userData?.gender || undefined,
        homeEnergyLabel: userData?.homeEnergyLabel || undefined,
        householdProfile: userData?.householdProfile || undefined,
        country: userData?.country || undefined,
        city: userData?.city || undefined,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormData,
    });

    const onSubmit = async (data) => {
        let success = false;
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            try {
                await setDoc(userRef, data, { merge: true });
                toast.success("Your profile was created successfully.");
                success = true;
            } catch (error) {
                console.error("Error writing document: ", error);
                toast.error("There was an error creating your profile.");
            }
        } else {
            toast.error("Please login to create a profile.");
        }

        if (onFormSubmit) {
            onFormSubmit(success);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className)}
            >
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormInputField
                            field={field}
                            inputType="text"
                            placeholder="First Name"
                            formLabel="First Name"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormInputField
                            field={field}
                            inputType="text"
                            placeholder="Last Name"
                            formLabel="Last Name"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="yearOfBirth"
                    render={({ field }) => (
                        <FormInputField
                            field={field}
                            inputType="number"
                            placeholder="Year of Birth"
                            formLabel="Year of Birth"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormSelect
                            field={field}
                            options={genderMappings.map((gender) => ({
                                value: gender.key,
                                label: t(gender.label),
                            }))}
                            placeholder="Please select your preferred gender"
                            formLabel={"Gender"}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="homeEnergyLabel"
                    render={({ field }) => (
                        <FormSelect
                            field={field}
                            options={homeEnergyLabels.map((label) => ({
                                value: label.key,
                                label: label.label,
                            }))}
                            placeholder="Please select your home energy label"
                            formLabel={"Home Energy Label"}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="householdProfile"
                    render={({ field }) => (
                        <FormSelect
                            field={field}
                            options={householdProfiles.map((profile) => ({
                                value: profile.key,
                                label: t(profile.label),
                            }))}
                            placeholder="Please select your household profile"
                            formLabel={"Household Profile"}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormSelect
                            field={field}
                            options={countriesMapping.map((country) => ({
                                value: country.ID,
                                label: t(country.name),
                            }))}
                            placeholder="Please select your country"
                            formLabel={"Country"}
                            {...(!isNewUser && { disabled: true })}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormSelect
                            field={field}
                            options={citiesMapping.map((city) => ({
                                value: city.ID,
                                label: t(city.name),
                            }))}
                            placeholder="Please select your city"
                            formLabel={"City"}
                            {...(!isNewUser && { disabled: true })}
                        />
                    )}
                />

                <Button type="submit">Save Profile</Button>
            </form>
        </Form>
    );
}
