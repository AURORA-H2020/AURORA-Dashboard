import { BorderBox } from "@/components/app/common/borderBox";
import { FormDatePicker } from "@/components/form-items/formDatePicker";
import { FormInputField } from "@/components/form-items/formInputField";
import { FormSelect } from "@/components/form-items/formSelect";
import { FormTextField } from "@/components/form-items/formTextField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { addEditConsumption } from "@/firebase/consumption/add-edit-consumption";
import {
  consumptionSources,
  fuelConsumptionEnabledTransportationTypes,
  privateVehicleTypes,
  publicVehicleOccupancies,
  publicVerhicleTypes,
} from "@/lib/constants/consumption-constants";
import {
  cn,
  convertUnit,
  isFieldRequired,
  useConvertUnit,
} from "@/lib/utilities";
import { transportationFormSchema } from "@/lib/zod/consumptionSchemas";
import { ConsumptionWithID } from "@/models/extensions";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { ReactElement, useEffect } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for transportation data entry.
 *
 * @param {ConsumptionWithID | undefined} consumption - The consumption data with an ID.
 * @param {boolean | undefined} isDuplication - Flag indicating if the entry is a duplication.
 * @param {(success: boolean) => void | undefined} onConsumptionAdded - Callback function for consumption added event.
 * @param {string | undefined} className - Additional CSS class for styling.
 * @return {ReactElement} The rendered form for transportation data entry.
 */
const TransportationForm = ({
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
  const formSchema = transportationFormSchema(t);

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

  const initialFormData: DefaultValues<Consumption> = {
    value:
      convertUnit(
        consumption?.value ?? 0,
        "km",
        userData?.settings?.unitSystem ?? "metric",
      ).quantity || undefined,
    category: "transportation",
    transportation: {
      transportationType:
        consumption?.transportation?.transportationType || undefined,
      fuelConsumption:
        convertUnit(
          consumption?.transportation?.fuelConsumption ?? 0,
          ["electricCar", "electricBike"].includes(
            consumption?.transportation?.transportationType ?? "",
          )
            ? "kWh/100km"
            : "L/100km",
          userData?.settings?.unitSystem ?? "metric",
        ).quantity || undefined,
      privateVehicleOccupancy:
        consumption?.transportation?.privateVehicleOccupancy || undefined,
      publicVehicleOccupancy:
        consumption?.transportation?.publicVehicleOccupancy || undefined,
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

  const formTransportationType = form.watch(
    "transportation.transportationType",
  );

  useEffect(() => {
    if (
      !fuelConsumptionEnabledTransportationTypes.includes(
        formTransportationType,
      )
    ) {
      form.setValue("transportation.fuelConsumption", undefined);
    }
    if (!privateVehicleTypes.includes(formTransportationType)) {
      form.setValue("transportation.privateVehicleOccupancy", undefined);
    }
    if (!publicVerhicleTypes.includes(formTransportationType)) {
      form.setValue("transportation.publicVehicleOccupancy", undefined);
    }
  }, [formTransportationType, form]);

  if (!user) return <></>;

  const onSubmit = async (data: Consumption) => {
    const { success } = await addEditConsumption(
      data,
      "transportation",
      user,
      userData?.settings?.unitSystem ?? "metric",
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "flex w-full flex-col gap-4")}
      >
        <BorderBox className="text-sm text-muted-foreground">
          {t("app.form.transportDisclaimer")}
        </BorderBox>
        <BorderBox>
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormInputField
                field={field}
                inputType="number"
                placeholder={t("unitLabel.distance")}
                label={t("unitLabel.distance")}
                unit={distanceUnit}
                required={isFieldRequired(formSchema, "value")}
              />
            )}
          />

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
                required={isFieldRequired(
                  formSchema,
                  "transportation.transportationType",
                )}
              />
            )}
          />

          {fuelConsumptionEnabledTransportationTypes.includes(
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
                  required={isFieldRequired(
                    formSchema,
                    "transportation.fuelConsumption",
                  )}
                />
              )}
            />
          )}

          {privateVehicleTypes.includes(formTransportationType) && (
            <FormField
              control={form.control}
              name="transportation.privateVehicleOccupancy"
              render={({ field }) => (
                <FormInputField
                  field={field}
                  inputType="number"
                  placeholder={t("app.form.occupancy")}
                  label={t("app.form.occupancy")}
                  required={true}
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
                  options={publicVehicleOccupancies.map((occupancy) => ({
                    value: occupancy.key,
                    label: t(occupancy.label),
                  }))}
                  placeholder={t("app.form.occupancy")}
                  label={t("app.form.occupancy")}
                  required={true}
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
                label={t("app.form.startOfTravel")}
                showTimePicker={true}
                maxDate={
                  form.watch("transportation.dateOfTravelEnd")?.toDate() ||
                  undefined
                }
                required={isFieldRequired(
                  formSchema,
                  "transportation.dateOfTravel",
                )}
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
                label={t("app.form.endOfTravel")}
                showTimePicker={true}
                showClearButton={true}
                minDate={form.watch("transportation.dateOfTravel").toDate()}
                required={false}
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
              placeholder={t("app.form.description")}
              label={t("app.form.description")}
              description={t("app.form.descriptionHelpText")}
              required={isFieldRequired(formSchema, "description")}
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

export { TransportationForm };
