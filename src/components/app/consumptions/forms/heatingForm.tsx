import { BorderBox } from "@/components/app/common/borderBox";
import { FormDatePicker } from "@/components/formItems/formDatePicker";
import { FormInputField } from "@/components/formItems/formInputField";
import { FormSelect } from "@/components/formItems/formSelect";
import { FormTextField } from "@/components/formItems/formTextField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { addEditConsumption } from "@/firebase/consumption/addEditConsumption";
import { consumptionSources } from "@/lib/constants/consumptions";
import {
  cn,
  convertUnit,
  getConsumptionUnit,
  isFieldRequired,
} from "@/lib/utilities";
import { heatingFormSchema } from "@/lib/zod/consumptionSchemas";
import { ConsumptionWithID } from "@/models/extensions";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { ReactElement, useEffect, useState } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for entering heating consumption data.
 *
 * @param {ConsumptionWithID} consumption - The consumption data with ID.
 * @param {boolean} isDuplication - Flag indicating duplication.
 * @param {(success: boolean) => void} onConsumptionAdded - Callback function for when consumption is added.
 * @param {string} className - Additional CSS classes for styling.
 * @return {ReactElement} The rendered HeatingForm component.
 */
const HeatingForm = ({
  consumption,
  isDuplication,
  onConsumptionAdded,
  className,
}: {
  consumption?: ConsumptionWithID;
  isDuplication?: boolean;
  onConsumptionAdded?: (_success: boolean) => void;
  className?: string;
}): ReactElement => {
  const t = useTranslations();
  const formSchema = heatingFormSchema(t);

  const { user } = useAuthContext();
  const { userData, userCountryData } = useFirebaseData();

  const [valueUnit, setValueUnit] = useState<{
    userUnit: "km" | "mi" | "L" | "gal" | "kWh" | "kg" | "lb";
    firebaseUnit: "km" | "L" | "kg" | "kWh";
  }>();

  const initialFormData: DefaultValues<Consumption> = {
    value:
      (consumption &&
        convertUnit(
          consumption?.value ?? 0,
          getConsumptionUnit(
            consumption,
            userData?.settings?.unitSystem ?? "metric",
          ).firebaseUnit,
          userData?.settings?.unitSystem ?? "metric",
        ).quantity) ||
      undefined,
    category: "heating",
    heating: {
      heatingFuel: consumption?.heating?.heatingFuel,
      districtHeatingSource:
        consumption?.heating?.districtHeatingSource || undefined,
      costs: consumption?.heating?.costs || undefined,
      householdSize: consumption?.heating?.householdSize || 1,
      startDate: consumption?.heating?.startDate || Timestamp.now(),
      endDate:
        consumption?.heating?.endDate ||
        Timestamp.fromMillis(Timestamp.now().toMillis() + 172800000),
    },
    description: consumption?.description || undefined,
    createdAt: consumption?.createdAt || Timestamp.now(),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormData,
  });

  const formHeatingFuel = form.watch("heating.heatingFuel");

  useEffect(() => {
    setValueUnit(
      getConsumptionUnit(
        form.getValues(),
        userData?.settings?.unitSystem ?? "metric",
      ),
    );
  }, [form, userData, formHeatingFuel]);

  useEffect(() => {
    if (formHeatingFuel !== "district") {
      form.setValue("heating.districtHeatingSource", undefined);
    }
  }, [formHeatingFuel, form]);

  if (!user) return <></>;

  const onSubmit = async (data: Consumption) => {
    const { success } = await addEditConsumption(
      data,
      "heating",
      user,
      userData?.settings?.unitSystem ?? "metric",
      isDuplication ? undefined : consumption?.id,
    );
    if (consumption?.id) {
      if (success) {
        toast.success(t("toast.consumption.updatedSuccessfully"));
      } else toast.error(t("toast.consumption.updatedError"));
    } else {
      if (success) {
        toast.success(t("toast.consumption.addedSuccessfully"));
      } else toast.error(t("toast.consumption.addedError"));
    }

    if (onConsumptionAdded) {
      onConsumptionAdded(success);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "flex flex-col gap-4 w-full")}
      >
        <BorderBox>
          <FormField
            control={form.control}
            name="heating.heatingFuel"
            render={({ field }) => (
              <FormSelect
                field={field}
                options={consumptionSources.heating.map((source) => ({
                  value: source.source,
                  label: t(source.name),
                }))}
                placeholder={t("app.form.heating.heatingFuel")}
                label={t("app.form.heating.heatingFuel")}
                description={t("app.form.heating.heatingFuelDescription")}
                required={isFieldRequired(formSchema, "heating.heatingFuel")}
              />
            )}
          />

          {formHeatingFuel === "district" && (
            <FormField
              control={form.control}
              name="heating.districtHeatingSource"
              render={({ field }) => (
                <FormSelect
                  field={field}
                  options={consumptionSources.districtHeating.map((source) => ({
                    value: source.source,
                    label: t(source.name),
                  }))}
                  placeholder={t("app.form.heating.districtHeatingSource")}
                  label={t("app.form.heating.districtHeatingSource")}
                  required={true}
                />
              )}
            />
          )}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormInputField
                field={field}
                inputType="number"
                placeholder={t("app.consumption")}
                label={t("app.consumption")}
                description={t("app.form.heating.heatingBillDescription")}
                unit={valueUnit?.userUnit}
                required={isFieldRequired(formSchema, "value")}
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
                placeholder={t("app.form.peopleInHousehold")}
                label={t("app.form.peopleInHousehold")}
                description={t("app.form.peopleInHouseholdDescription")}
                required={isFieldRequired(formSchema, "heating.householdSize")}
              />
            )}
          />
        </BorderBox>

        <BorderBox>
          <FormField
            control={form.control}
            name="heating.startDate"
            render={({ field }) => (
              <FormDatePicker
                field={field}
                placeholder={t("common.placeholder.selectDate")}
                label={t("ui.monthPicker.start")}
                maxDate={form.watch("heating.endDate").toDate()}
                required={isFieldRequired(formSchema, "heating.startDate")}
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
                label={t("ui.monthPicker.end")}
                minDate={form.watch("heating.startDate").toDate()}
                description={t("app.form.heating.dateSelectDescription")}
                required={isFieldRequired(formSchema, "heating.endDate")}
              />
            )}
          />
        </BorderBox>

        <BorderBox>
          <FormField
            control={form.control}
            name="heating.costs"
            render={({ field }) => (
              <FormInputField
                field={field}
                inputType="number"
                placeholder={t("app.form.costs")}
                label={t("app.form.costs")}
                unit={userCountryData?.currencyCode ?? "EUR"}
                required={isFieldRequired(formSchema, "heating.costs")}
              />
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormTextField
                field={field}
                placeholder={t("app.form.description")}
                label={t("app.form.description")}
                description={t("app.form.descriptionHelpText")}
                required={isFieldRequired(formSchema, "description")}
              />
            )}
          />
        </BorderBox>

        <DialogFooter className="flex sm:justify-between">
          <Button type="submit">
            {consumption ? t("app.updateConsumption") : t("app.addConsumption")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export { HeatingForm };
