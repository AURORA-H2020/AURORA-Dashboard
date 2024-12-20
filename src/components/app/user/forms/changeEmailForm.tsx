import { FormInputField } from "@/components/form-items/formInputField";
import { FormPasswordField } from "@/components/form-items/formPasswordField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { changeEmail } from "@/firebase/user/change-email";
import { cn } from "@/lib/utilities";
import { userChangeEmailSchema } from "@/lib/zod/userSchemas";
import { useAuthContext } from "@/providers/context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for changing the user's email address.
 *
 * @param {Object} props - The component props.
 * @param {function} props.onFormSubmit - A callback function to be called when the form is submitted successfully.
 * @param {string} props.className - The CSS class name for the form container.
 * @return {ReactElement} The rendered form component.
 */
const ChangeEmailForm = ({
  onFormSubmit,
  className,
}: {
  onFormSubmit?: (_success: boolean) => void;
  className?: string;
}): ReactElement => {
  const t = useTranslations();
  const formSchema = userChangeEmailSchema(t);

  const { user } = useAuthContext() as {
    user: User;
  };

  const initialFormData: DefaultValues<z.infer<typeof formSchema>> = {
    email: user.email || undefined,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormData,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    changeEmail(user, data.currentPassword, data.email).then((result) => {
      if (result.success) {
        toast.success(t("toast.changeEmail.success"));
      } else
        toast.error(t("toast.changeEmail.errorTitle"), {
          description: t("toast.changeEmail.errorDescription"),
        });

      if (onFormSubmit && result.success) {
        onFormSubmit(result.success);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "mt-4 flex w-full flex-col gap-4")}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInputField
              field={field}
              inputType="email"
              placeholder={t("ui.auth.email")}
              label={t("ui.auth.email")}
            />
          )}
        />

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormPasswordField
              field={field}
              placeholder={t("ui.auth.currentPassword")}
              label={t("ui.auth.currentPassword")}
            />
          )}
        />

        <DialogFooter className="flex sm:justify-between">
          <Button type="submit">{t("app.account.changeEmail")}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export { ChangeEmailForm };
