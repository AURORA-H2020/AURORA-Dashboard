import FormInputField from "@/components/formItems/formInputField";
import FormPasswordField from "@/components/formItems/formPasswordField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import authenticate from "@/firebase/auth/authentication";
import { cn } from "@/lib/utilities";
import { loginSchema } from "@/lib/zod/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
const SignInWithEmail = ({ className }: { className?: string }) => {
    const t = useTranslations();

    const formSchema = loginSchema(t);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /**
     * Function for handling post sign-in actions.
     */
    const postSignIn = () => {
        toast.success(t("toast.auth.success"));
    };

    /**
     * Attempt to sign in with provided email and password
     *
     * @param {z.infer<typeof formSchema>} values - input values for email and password
     * @return {Promise<void>}
     */
    async function handleSignInWithEmail(values: z.infer<typeof formSchema>) {
        // Attempt to sign in with provided email and password
        const { error } = await authenticate(
            "email-signin",
            values.email,
            values.password,
        );

        if (error) {
            // Display and log any sign-in errors
            console.log(error);
            toast.error(t("toast.auth.error"));
        } else {
            postSignIn();
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSignInWithEmail)}
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
                            showTogglePassword={true}
                        />
                    )}
                />

                <Button className="w-full" type="submit">
                    {t("ui.auth.signIn")}
                </Button>
            </form>
        </Form>
    );
};

export default SignInWithEmail;
