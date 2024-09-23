import { FormInputField } from "@/components/formItems/formInputField";
import { FormPasswordField } from "@/components/formItems/formPasswordField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { authenticate } from "@/firebase/auth/authentication";
import { cn } from "@/lib/utilities";
import { registrationSchema } from "@/lib/zod/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

/**
 * Renders a form for signing up with email and password.
 *
 * @param {string} className - optional class name for styling
 * @return {ReactNode} the rendered form component
 */
function SignUpWithEmail({ className }: { className?: string }): ReactNode {
  const t = useTranslations();

  const formSchema = registrationSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Function for handling user sign-up.
   */
  const postSignUp = () => {
    toast.success(t("toast.auth.success"));
  };

  /**
   * Handle sign up with email and password.
   *
   * @param {type} values - description of parameter
   * @return {type} undefined
   */
  async function handleSignUpWithEmail(values: z.infer<typeof formSchema>) {
    // Attempt to sign in with provided email and password
    const { error } = await authenticate(
      "email-signup",
      values.email,
      values.password,
    );

    if (error) {
      // Display and log any sign-in errors
      console.error("Error signing in user: ", error);
      toast.error(t("toast.auth.error"));
    } else {
      postSignUp();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignUpWithEmail)}
        className={cn(className, "flex flex-col gap-4 w-full mt-4")}
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
          name="password"
          render={({ field }) => (
            <FormPasswordField
              field={field}
              placeholder={t("ui.auth.password")}
              label={t("ui.auth.password")}
            />
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormPasswordField
              field={field}
              placeholder={t("ui.auth.password")}
              label={t("ui.auth.confirmPassword")}
            />
          )}
        />
        <Button className="w-full" type="submit">
          {t("ui.auth.signUp")}
        </Button>
      </form>
    </Form>
  );
}

export { SignUpWithEmail };
