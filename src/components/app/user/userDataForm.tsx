import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import FormSwitch from "@/components/formItems/formSwitch";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { addEditUserData } from "@/firebase/user/addEditUserData";
import {
    countriesMapping,
    genderMappings,
    homeEnergyLabels,
    householdProfiles,
} from "@/lib/constants";
import { cn } from "@/lib/utilities";
import { userDataFormSchema } from "@/lib/zod/userSchemas";
import { CityMapping } from "@/models/constants";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BorderBox from "../common/borderBox";

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
        isMarketingConsentAllowed: userData?.isMarketingConsentAllowed || false,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormData,
    });

    const onSubmit = async (userData: FirebaseUser) => {
        const { success } = await addEditUserData(userData, user);

        if (success) {
            if (isNewUser) {
                toast.success("Your profile was created successfully");
            } else {
                toast.success("Your profile was updated successfully");
            }
        } else {
            if (isNewUser) {
                toast.error("There was an error creating your profile");
            } else {
                toast.error("There was an error updating your profile");
            }
        }

        if (onFormSubmit) {
            onFormSubmit(success);
        }
    };

    const selectedCountry = form.watch("country");
    const [availableCities, setAvailableCities] = useState<CityMapping[]>([]);

    useEffect(() => {
        if (selectedCountry) {
            const country = countriesMapping.find(
                (country) => country.ID === selectedCountry,
            );

            if (country) {
                setAvailableCities(country.cities);
            }
        }
        form.setValue("city", undefined);
    }, [form, selectedCountry]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, "flex flex-col gap-4 w-full")}
            >
                <BorderBox>
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormInputField
                                field={field}
                                inputType="text"
                                placeholder="First Name"
                                label="First Name"
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
                                label="Last Name"
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
                                label="Year of Birth"
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
                                placeholder="Select your preferred gender"
                                label={"Gender"}
                                optOutLabel="Prefer not to say"
                            />
                        )}
                    />
                </BorderBox>
                {isNewUser && (
                    <BorderBox>
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormSelect
                                    field={field}
                                    options={countriesMapping.map(
                                        (country) => ({
                                            value: country.ID,
                                            label: t(country.name),
                                        }),
                                    )}
                                    placeholder="Select your country"
                                    label={"Country"}
                                    description="This information helps us to more accurately calculate your
                            carbon footprint. Please note that you can't change
                            your country later. Crowdfunding of local photovoltaic
                            installations is currently only planned for select cities of
                            AURORA project partners."
                                />
                            )}
                        />

                        {availableCities.length > 0 && (
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormSelect
                                        key={selectedCountry}
                                        field={field}
                                        options={availableCities.map(
                                            (city) => ({
                                                value: city.ID,
                                                label: t(city.name),
                                            }),
                                        )}
                                        optOutLabel="Other city"
                                        placeholder="Select your city"
                                        label={"City"}
                                    />
                                )}
                            />
                        )}
                    </BorderBox>
                )}

                <BorderBox>
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
                                placeholder="Select your home energy label"
                                label={"Home Energy Label"}
                                optOutLabel="Prefer not to say"
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
                                placeholder="Select your household profile"
                                label={"Household Profile"}
                                optOutLabel="Prefer not to say"
                            />
                        )}
                    />
                </BorderBox>

                {isNewUser && (
                    <FormField
                        control={form.control}
                        name="isMarketingConsentAllowed"
                        render={({ field }) => (
                            <FormSwitch
                                field={field}
                                description="I would like to receive updates about the app and AURORA project by email."
                            />
                        )}
                    />
                )}

                <Button type="submit">Save Profile</Button>
            </form>
        </Form>
    );
}
