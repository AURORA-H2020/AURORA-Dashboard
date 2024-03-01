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
import BorderBox from "../../common/borderBox";

export function ChangePasswordForm({
    onFormSubmit,
    className,
}: {
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}) {
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
                    toast.success("Your password was updated successfully");
                } else
                    toast.error("An error occurred updating your password", {
                        description:
                            "Please check your current password and try again.",
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
                            placeholder={"Current Password"}
                            label={"Current Password"}
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
                    <Button type="submit">Update Password</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
