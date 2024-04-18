"use client";

import BorderBox from "@/components/app/common/borderBox";
import FormPasswordField from "@/components/formItems/formPasswordField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { changePassword } from "@/firebase/user/changePassword";
import { cn } from "@/lib/utilities";
import { userChangePasswordSchema } from "@/lib/zod/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for changing the user's password.
 *
 * @param {Object} props - The component props.
 * @param {function} props.onFormSubmit - A callback function to be called when the form is submitted successfully.
 * @param {string} props.className - The CSS class name for the form container.
 * @return {React.ReactElement} The rendered form component.
 */
const ChangePasswordForm = ({
    onFormSubmit,
    className,
}: {
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}): React.ReactElement => {
    const t = useTranslations();
    const formSchema = userChangePasswordSchema(t);

    const { user } = useAuthContext() as {
        user: User;
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        changePassword(user, data.currentPassword, data.password).then(
            (result) => {
                if (result.success) {
                    toast.success(t("toast.changePassword.success"));
                } else
                    toast.error(t("toast.changePassword.errorTitle"), {
                        description: t("toast.changePassword.errorDescription"),
                    });

                if (onFormSubmit && result.success) {
                    onFormSubmit(result.success);
                }
            },
        );
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, "flex flex-col gap-4 w-full mt-4")}
            >
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

                <BorderBox>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormPasswordField
                                field={field}
                                placeholder={t("ui.auth.newPassword")}
                                label={t("ui.auth.newPassword")}
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormPasswordField
                                field={field}
                                placeholder={t("ui.auth.confirmNewPassword")}
                                label={t("ui.auth.confirmNewPassword")}
                            />
                        )}
                    />
                </BorderBox>

                <DialogFooter className="flex sm:justify-between">
                    <Button type="submit">
                        {t("app.account.changePassword")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default ChangePasswordForm;
