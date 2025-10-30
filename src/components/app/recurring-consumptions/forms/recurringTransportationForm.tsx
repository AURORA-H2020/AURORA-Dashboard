"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { FormInputField } from "@/components/form-items/formInputField";
import { FormMultiSelect } from "@/components/form-items/formMultiSelect";
import { FormSelect } from "@/components/form-items/formSelect";
import { FormSwitch } from "@/components/form-items/formSwitch";
import { FormTextField } from "@/components/form-items/formTextField";
import { FormTimePicker } from "@/components/form-items/formTimePicker";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormLabel } from "@/components/ui/form";
import { addEditRecurringConsumption } from "@/firebase/consumption/add-edit-recurring-consumption";
import { weekdays } from "@/lib/constants/common-constants";
import {
  consumptionSources,
  fuelConsumptionEnabledTransportationTypes,
  privateVehicleTypes,
  publicVehicleOccupancies,
  publicVerhicleTypes,
  recurringConsumptionFrequencies,
} from "@/lib/constants/consumption-constants";
import { cn, convertUnit, useConvertUnit } from "@/lib/utilities";
import { recurringTransportationFormSchema } from "@/lib/zod/recurringConsumptionSchemas";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Strong } from "@radix-ui/themes";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const RecurringTransportationForm = ({
  recurringConsumption,
  onFormSubmit,
  className,
}: {
  recurringConsumption?: RecurringConsumptionWithID;
  onFormSubmit?: (_success: boolean) => void;
  className?: string;
}) => {
  const t = useTranslations();
  const formSchema = recurringTransportationFormSchema(t);

  const { user } = useAuthContext();
  const { userData } = useFirebaseData();

  const distanceUnit = useConvertUnit(
    100,
    "km",
    userData?.settings?.unitSystem ?? "metric",
  )?.unit;

  const fuelConsumptionUnitRegular = useConvertUnit(
    100,
    "L/100km",
    userData?.settings?.unitSystem ?? "metric",
  )?.unit;

  const fuelConsumptionUnitElectric = useConvertUnit(
    100,
    "kWh/100km",
    userData?.settings?.unitSystem ?? "metric",
  )?.unit;

  const initialFormData: DefaultValues<RecurringConsumption> = {
    createdAt: recurringConsumption?.createdAt || Timestamp.now(),
    isEnabled: recurringConsumption?.isEnabled ?? true,
    frequency: {
      unit: recurringConsumption?.frequency?.unit || "daily",
      weekdays: recurringConsumption?.frequency?.weekdays || undefined,
      dayOfMonth: recurringConsumption?.frequency?.dayOfMonth ?? undefined,
    },
    category: "transportation",
    transportation: {
      transportationType:
        recurringConsumption?.transportation?.transportationType || undefined,
      fuelConsumption:
        convertUnit(
          recurringConsumption?.transportation?.fuelConsumption ?? 0,
          ["electricCar", "electricBike"].includes(
            recurringConsumption?.transportation?.transportationType ?? "",
          )
            ? "kWh/100km"
            : "L/100km",
          userData?.settings?.unitSystem ?? "metric",
        ).quantity || undefined,
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
        convertUnit(
          recurringConsumption?.transportation?.distance ?? 0,
          "km",
          userData?.settings?.unitSystem ?? "metric",
        ).quantity || undefined,
    },
    description: recurringConsumption?.description || "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormData,
  });

  const formTransportationType = form.watch(
    "transportation.transportationType",
  );
  const formFrequencyUnit = form.watch("frequency.unit");

  useEffect(() => {
    if (
      formTransportationType &&
      !fuelConsumptionEnabledTransportationTypes.includes(
        formTransportationType,
      )
    ) {
      form.setValue("transportation.fuelConsumption", undefined);
    }
    if (
      formTransportationType &&
      !privateVehicleTypes.includes(formTransportationType)
    ) {
      form.setValue("transportation.privateVehicleOccupancy", undefined);
    }
    if (
      formTransportationType &&
      !publicVerhicleTypes.includes(formTransportationType)
    ) {
      form.setValue("transportation.publicVehicleOccupancy", undefined);
    }
    if (formFrequencyUnit !== "weekly") {
      form.setValue("frequency.weekdays", undefined);
    }
    if (formFrequencyUnit !== "monthly") {
      form.setValue("frequency.dayOfMonth", undefined);
    }
  }, [formTransportationType, form, formFrequencyUnit]);

  if (!user) return null;

  const onSubmit = async (data: RecurringConsumption) => {
    const { success } = await addEditRecurringConsumption(
      data,
      "transportation",
      user,
      userData?.settings?.unitSystem ?? "metric",
      recurringConsumption?.id,
    );
    if (success) {
      if (recurringConsumption?.id) {
        toast.success(t("toast.consumption.updatedSuccessfully"));
      } else {
        toast.success(t("toast.consumption.addedSuccessfully"));
      }
    } else {
      toast.error(t("toast.consumption.addedError"));
    }

    if (onFormSubmit) {
      onFormSubmit(success);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "flex w-full flex-col gap-4")}
      >
        <FormField
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <FormSwitch
              field={field}
              label={t("app.form.enabled")}
              description={t("app.form.recurringToggleDescription")}
            />
          )}
        />

        <BorderBox className="text-sm text-muted-foreground">
          {t("app.form.transportDisclaimer")}
        </BorderBox>

        <BorderBox>
          <FormField
            control={form.control}
            name="frequency.unit"
            render={({ field }) => (
              <FormSelect
                field={field}
                options={recurringConsumptionFrequencies.map((occupancy) => ({
                  value: occupancy.key,
                  label: t(occupancy.label),
                }))}
                placeholder={t("app.form.frequency")}
                label={t("app.form.frequency")}
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
                  placeholder={t("app.form.weekdays")}
                  label={t("app.form.weekdays")}
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
                  placeholder={t("app.form.dayOfMonth")}
                  label={t("app.form.dayOfMonth")}
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
                placeholder={t("unitLabel.distance")}
                label={t("unitLabel.distance")}
                unit={distanceUnit}
              />
            )}
          />
        </BorderBox>

        <BorderBox>
          <Flex justify="between" align="center">
            <FormLabel>{t("app.form.startOfTravel")}</FormLabel>
            <Flex justify="between" align="center" gap="8">
              <FormField
                control={form.control}
                name="transportation.hourOfTravel"
                render={({ field }) => (
                  <FormTimePicker field={field} picker="hours" />
                )}
              />
              <div className="mx-2">
                <Strong>:</Strong>
              </div>
              <FormField
                control={form.control}
                name="transportation.minuteOfTravel"
                render={({ field }) => (
                  <FormTimePicker field={field} picker="minutes" />
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
                options={consumptionSources.transportation.map((source) => ({
                  value: source.source,
                  label: t(source.name),
                }))}
                placeholder={t("app.form.transportationType")}
                label={t("app.form.transportationType")}
              />
            )}
          />

          {formTransportationType &&
            fuelConsumptionEnabledTransportationTypes.includes(
              formTransportationType,
            ) && (
              <FormField
                control={form.control}
                name="transportation.fuelConsumption"
                render={({ field }) => (
                  <FormInputField
                    field={field}
                    inputType="number"
                    placeholder={
                      !["electricCar", "electricBike"].includes(
                        formTransportationType,
                      )
                        ? t("app.form.fuelConsumption")
                        : t("app.form.powerConsumption")
                    }
                    label={
                      !["electricCar", "electricBike"].includes(
                        formTransportationType,
                      )
                        ? t("app.form.setCustomFuelConsumption")
                        : t("app.form.setCustomPowerConsumption")
                    }
                    showSwitch={true}
                    unit={
                      ["electricCar", "electricBike"].includes(
                        formTransportationType,
                      )
                        ? fuelConsumptionUnitElectric
                        : fuelConsumptionUnitRegular
                    }
                  />
                )}
              />
            )}

          {formTransportationType &&
            privateVehicleTypes.includes(formTransportationType) && (
              <FormField
                control={form.control}
                name="transportation.privateVehicleOccupancy"
                render={({ field }) => (
                  <FormInputField
                    field={field}
                    inputType="number"
                    placeholder={t("app.form.occupancy")}
                    label={t("app.form.occupancy")}
                  />
                )}
              />
            )}

          {formTransportationType &&
            publicVerhicleTypes.includes(formTransportationType) && (
              <FormField
                control={form.control}
                name="transportation.publicVehicleOccupancy"
                render={({ field }) => (
                  <FormSelect
                    field={field}
                    options={publicVehicleOccupancies.map((occupancy) => ({
                      value: occupancy.key,
                      label: t(occupancy.label),
                    }))}
                    placeholder={t("app.form.occupancy")}
                    label={t("app.form.occupancy")}
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
              placeholder={t("app.form.description")}
              label={t("app.form.description")}
              description={t("app.form.descriptionHelpText")}
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

export { RecurringTransportationForm };
