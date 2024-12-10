"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { FormInputField } from "@/components/form-items/formInputField";
import { FormSelect } from "@/components/form-items/formSelect";
import { FormSwitch } from "@/components/form-items/formSwitch";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { firebaseApp } from "@/firebase/config";
import { addEditUserData } from "@/firebase/user/add-edit-user-data";
import {
  countriesMapping,
  genderMappings,
  householdProfiles,
  unitSystems,
} from "@/lib/constants/common-constants";
import { labelMappings } from "@/lib/constants/consumption-constants";
import { cn, isFieldRequired } from "@/lib/utilities";
import { userDataFormSchema } from "@/lib/zod/userSchemas";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from "firebase/remote-config";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for user data submission.
 *
 * @param {Object} props - The component props.
 * @param {(success: boolean) => void} props.onFormSubmit - The callback function to handle form submission.
 * @param {boolean} props.isNewUser - Indicates if the user is new.
 * @param {string} props.className - The CSS class name for the form.
 * @return {ReactNode} The rendered form component.
 */
const UserDataForm = ({
  onFormSubmit,
  isNewUser = false,
  className,
}: {
  onFormSubmit?: (_success: boolean) => void;
  isNewUser?: boolean;
  className?: string;
}): ReactNode => {
  const t = useTranslations();
  const formSchema = userDataFormSchema(t);

  const { user } = useAuthContext() as {
    user: User;
  };

  const { userData } = useFirebaseData();

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
    settings: {
      unitSystem: userData?.settings?.unitSystem || "metric",
    },
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

  useEffect(() => {
    if (!isNewUser) return;

    form.setValue("city", undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewUser, selectedCountry]);

  const availableCities = countriesMapping.find(
    (country) => country.ID === selectedCountry,
  )?.cities;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "flex w-full flex-col gap-4")}
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
                required={isFieldRequired(formSchema, "firstName")}
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
                required={isFieldRequired(formSchema, "lastName")}
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
                required={isFieldRequired(formSchema, "yearOfBirth")}
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
                required={isFieldRequired(formSchema, "gender")}
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
                  options={countriesMapping.map((country) => ({
                    value: country.ID,
                    label: t(country.name),
                  }))}
                  placeholder={t("app.form.profile.selectCountry")}
                  label={t("app.profile.country")}
                  description={t("app.form.profile.selectCountryDescription")}
                  required={isFieldRequired(formSchema, "country")}
                />
              )}
            />

            {availableCities && availableCities.length > 0 && (
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormSelect
                    key={selectedCountry}
                    field={field}
                    options={availableCities.map((city) => ({
                      value: city.ID,
                      label: t(city.name),
                    }))}
                    placeholder={t("app.form.profile.selectCity")}
                    label={t("app.profile.city")}
                    optOutLabel={t("city.otherCity")}
                    required={isFieldRequired(formSchema, "city")}
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
                placeholder={t("app.form.profile.selectHomeEnergyLabel")}
                label={t("app.profile.homeEnergyLabel")}
                optOutLabel={t("common.preferNotToSay")}
                required={isFieldRequired(formSchema, "homeEnergyLabel")}
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
                placeholder={t("app.form.profile.selectHouseholdProfile")}
                label={t("app.profile.householdProfile")}
                optOutLabel={t("common.preferNotToSay")}
                required={isFieldRequired(formSchema, "householdProfile")}
              />
            )}
          />

          <FormField
            control={form.control}
            name="settings.unitSystem"
            render={({ field }) => (
              <FormSelect
                field={field}
                options={unitSystems.map((unitSystem) => ({
                  value: unitSystem.key,
                  label: t(unitSystem.label),
                }))}
                placeholder={t("app.form.profile.selectUnitSystem")}
                label={t("app.profile.unitSystem")}
                required={isFieldRequired(formSchema, "unitSystem")}
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
                description={t("app.form.profile.marketingConsentDescription")}
                required={isFieldRequired(
                  formSchema,
                  "isMarketingConsentAllowed",
                )}
              />
            )}
          />
        )}

        <Button type="submit">{t("app.form.profile.saveProfile")}</Button>
      </form>
    </Form>
  );
};

export { UserDataForm };
