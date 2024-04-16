"use client";

import BorderBox from "@/components/app/common/borderBox";
import FormInputField from "@/components/formItems/formInputField";
import FormSelect from "@/components/formItems/formSelect";
import FormSwitch from "@/components/formItems/formSwitch";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { firebaseApp } from "@/firebase/config";
import { addEditUserData } from "@/firebase/user/addEditUserData";
import {
    countriesMapping,
    genderMappings,
    householdProfiles,
} from "@/lib/constants/constants";
import { labelMappings } from "@/lib/constants/consumptions";
import { cn } from "@/lib/utilities";
import { userDataFormSchema } from "@/lib/zod/userSchemas";
import { CityMapping } from "@/models/constants";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import {
    fetchAndActivate,
    getRemoteConfig,
    getValue,
} from "firebase/remote-config";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UserDataForm = ({
    userData,
    onFormSubmit,
    isNewUser = false,
    className,
}: {
    userData?: FirebaseUser | null;
    onFormSubmit?: (success: boolean) => void;
    isNewUser?: boolean;
    className?: string;
}) => {
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
        acceptedLegalDocumentVersion:
            userData?.acceptedLegalDocumentVersion || undefined,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormData,
    });

    const onSubmit = async (userData: FirebaseUser) => {
        const { success } = await addEditUserData(userData, user);

        if (success) {
            if (isNewUser) {
                toast.success(t("toast.createProfile.success"));
            } else {
                toast.success(t("toast.updateProfile.success"));
            }
        } else {
            if (isNewUser) {
                toast.error(t("toast.createProfile.error"));
            } else {
                toast.error(t("toast.updateProfile.error"));
            }
        }

        if (onFormSubmit) {
            onFormSubmit(success);
        }
    };

    useEffect(() => {
        if (isNewUser) {
            const remoteConfig = getRemoteConfig(firebaseApp);

            fetchAndActivate(remoteConfig).then(() => {
                const latestVersion = getValue(
                    remoteConfig,
                    "latestLegalDocumentsVersion",
                ).asNumber();
                form.setValue("acceptedLegalDocumentVersion", latestVersion);
            });
        }
    }, [form, isNewUser]);

    const selectedCountry = form.watch("country");
    const [availableCities, setAvailableCities] = useState<CityMapping[]>([]);

    useEffect(() => {
        if (!isNewUser) return;

        if (selectedCountry) {
            const country = countriesMapping.find(
                (country) => country.ID === selectedCountry,
            );

            if (country) {
                setAvailableCities(country.cities);
            }
        }
        form.setValue("city", undefined);
    }, [form, isNewUser, selectedCountry]);

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
                                placeholder={t("app.profile.firstName")}
                                label={t("app.profile.firstName")}
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
                                placeholder={t("app.profile.lastName")}
                                label={t("app.profile.lastName")}
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
                                placeholder={t("app.profile.yearOfBirth")}
                                label={t("app.profile.yearOfBirth")}
                                optOutLabel={t("common.preferNotToSay")}
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
                                placeholder={t("app.form.profile.selectGender")}
                                label={t("app.profile.gender")}
                                optOutLabel={t("common.preferNotToSay")}
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
                                    placeholder={t(
                                        "app.form.profile.selectCountry",
                                    )}
                                    label={t("app.profile.country")}
                                    description={t(
                                        "app.form.profile.selectCountryDescription",
                                    )}
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
                                        placeholder={t(
                                            "app.form.profile.selectCity",
                                        )}
                                        label={t("app.profile.city")}
                                        optOutLabel={t("city.otherCity")}
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
                                options={[
                                    ...labelMappings.map((label) => ({
                                        value: label.label,
                                        label: label.label,
                                    })),
                                    {
                                        value: "unsure",
                                        label: t("common.unsure"),
                                    },
                                ]}
                                placeholder={t(
                                    "app.form.profile.selectHomeEnergyLabel",
                                )}
                                label={t("app.profile.homeEnergyLabel")}
                                optOutLabel={t("common.preferNotToSay")}
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
                                placeholder={t(
                                    "app.form.profile.selectHouseholdProfile",
                                )}
                                label={t("app.profile.householdProfile")}
                                optOutLabel={t("common.preferNotToSay")}
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
                                description={t(
                                    "app.form.profile.marketingConsentDescription",
                                )}
                            />
                        )}
                    />
                )}

                <Button type="submit">
                    {t("app.form.profile.saveProfile")}
                </Button>
            </form>
        </Form>
    );
};

export default UserDataForm;
