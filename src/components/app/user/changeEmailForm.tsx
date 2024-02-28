import FormInputField from "@/components/formItems/formInputField";
import FormPasswordField from "@/components/formItems/formPasswordField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { changeEmail } from "@/firebase/user/changeEmail";
import { cn } from "@/lib/utilities";
import { userChangeEmailSchema } from "@/lib/zod/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ChangeEmailForm({
    onFormSubmit,
    className,
}: {
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}) {
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
                toast.success("Your email was updated successfully");
            } else
                toast.error("An error occurred updating your email", {
                    description:
                        "Please check your current password and try again.",
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

                <DialogFooter className="flex sm:justify-between">
                    <Button type="submit">Update Email</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
