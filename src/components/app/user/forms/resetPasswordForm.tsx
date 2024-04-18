import FormInputField from "@/components/formItems/formInputField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { resetPassword } from "@/firebase/auth/resetPassword";
import { cn } from "@/lib/utilities";
import { passwordResetSchema } from "@/lib/zod/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for resetting a user's password.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onFormSubmit - A callback function called when the form is submitted.
 * @param {string} props.className - The CSS class name for the form container.
 * @return {React.ReactElement} The rendered form component.
 */
const ResetPasswordForm = ({
    onFormSubmit,
    className,
}: {
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}): React.ReactElement => {
    const t = useTranslations();
    const formSchema = passwordResetSchema(t);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        resetPassword(data.email).then((result) => {
            if (result.success) {
                toast.success(t("toast.resetPassword.successTitle"), {
                    description: t("toast.resetPassword.successDescription"),
                });
            } else
                toast.error(t("toast.resetPassword.errorTitle"), {
                    description: t("toast.resetPassword.errorDescription"),
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

                <DialogFooter className="flex sm:justify-between">
                    <Button type="submit">
                        {t("ui.auth.resetPassword.resetPassword")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default ResetPasswordForm;
