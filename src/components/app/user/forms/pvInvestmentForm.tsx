"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { FormDatePicker } from "@/components/form-items/formDatePicker";
import { FormInputField } from "@/components/form-items/formInputField";
import { FormTextField } from "@/components/form-items/formTextField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { addEditPvInvestment } from "@/firebase/user/add-edit-pv-investment";
import { cn, isFieldRequired } from "@/lib/utilities";
import { userPvInvestmentSchema } from "@/lib/zod/userSchemas";
import { UserPvInvestmentWithID } from "@/models/extensions";
import { UserPvInvestment } from "@/models/firestore/user/user-pv-investment/user-pv-investment";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { Timestamp } from "@firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for PV data submission.
 *
 * @param {Object} props - The component props.
 * @param {(success: boolean) => void} props.onFormSubmit - The callback function to handle form submission.
 * @param {string} props.className - The CSS class name for the form.
 * @return {ReactNode} The rendered form component.
 */
const PvInvestmentForm = ({
  pvInvestment,
  onFormSubmit,
  className,
}: {
  pvInvestment?: UserPvInvestmentWithID;
  onFormSubmit?: (_success: boolean) => void;
  className?: string;
}): ReactNode => {
  const t = useTranslations();
  const formSchema = userPvInvestmentSchema(t);

  const { userData, pvPlants } = useFirebaseData();
  const { user } = useAuthContext() as {
    user: User;
  };

  const pvPlant = pvPlants.find((p) => p.city === userData?.city);

  const initialFormData: DefaultValues<UserPvInvestment> = {
    investmentPrice: pvInvestment?.investmentPrice || undefined,
    investmentCapacity: pvInvestment?.investmentCapacity || undefined,
    share: pvInvestment?.share || undefined,
    investmentDate: pvInvestment?.investmentDate || undefined,
    city: pvInvestment?.city || userData?.city || undefined,
    pvPlant: pvPlant?.id || undefined,
    note: pvInvestment?.note || undefined,
    createdAt: pvInvestment?.createdAt || Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormData,
  });

  const onSubmit = async (formData: UserPvInvestment) => {
    const { success } = await addEditPvInvestment(
      formData,
      user,
      pvInvestment?.id,
    );

    if (success) {
      toast.success(t("toast.pvInvestment.success"));
    } else {
      toast.error(t("toast.pvInvestment.error"));
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
        <BorderBox>
          <FormField
            control={form.control}
            name="share"
            render={({ field }) => (
              <FormInputField
                field={field}
                inputType="number"
                placeholder={t("app.form.pvInvestment.share")}
                label={t("app.form.pvInvestment.share")}
                description={t("app.form.pvInvestment.shareDescription")}
                required={isFieldRequired(formSchema, "share")}
              />
            )}
          />
          <FormField
            control={form.control}
            name="investmentDate"
            render={({ field }) => (
              <FormDatePicker
                field={field}
                placeholder={t("app.form.pvInvestment.investmentDate")}
                label={t("app.form.pvInvestment.investmentDate")}
                required={isFieldRequired(formSchema, "investmentDate")}
                maxDate={new Date()}
                minDate={pvPlant?.installationDate?.toDate()}
              />
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormTextField
                field={field}
                placeholder={t("app.form.pvInvestment.note")}
                label={t("app.form.pvInvestment.note")}
                description={t("app.form.pvInvestment.noteDescription")}
                required={isFieldRequired(formSchema, "note")}
              />
            )}
          />
        </BorderBox>

        <Button type="submit">{t("app.form.pvInvestment.save")}</Button>
      </form>
    </Form>
  );
};

export { PvInvestmentForm };
