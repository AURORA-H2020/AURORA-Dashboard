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

const ResetPasswordForm = ({
    onFormSubmit,
    className,
}: {
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}) => {
    const t = useTranslations();
    const formSchema = passwordResetSchema(t);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        resetPassword(data.email).then((result) => {
            if (result.success) {
                toast.success("Your password was reset", {
                    description: "Check your email for further instructions.",
                });
            } else
                toast.error("An error occurred resetting your password", {
                    description:
                        "Please check the email address you provided is accurate and you have an existing account.",
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
                            placeholder="Email"
                            label="Email"
                        />
                    )}
                />

                <DialogFooter className="flex sm:justify-between">
                    <Button type="submit">Reset Password</Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default ResetPasswordForm;
