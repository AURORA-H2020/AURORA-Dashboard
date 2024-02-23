import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import signUp from "@/firebase/auth/authentication";
import { registrationSchema } from "@/lib/zod/authSchemas";
import { useRouter } from "@/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import FormInputField from "../formItems/formInputField";
import FormPasswordField from "../formItems/formPasswordField";

/**
 * Function for signing up with email.
 *
 * @param {z.infer<typeof formSchema>} values - the form values
 * @return {JSX.Element} the sign up form
 */
function SignUpWithEmail(): JSX.Element {
    const t = useTranslations();
    const router = useRouter();

    const formSchema = registrationSchema(t);

    /* TODO: Add Password confirmation and validation (password strength) */
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
        router.push("/account");
    };

    /**
     * Handle sign up with email and password.
     *
     * @param {type} values - description of parameter
     * @return {type} undefined
     */
    async function handleSignUpWithEmail(values: z.infer<typeof formSchema>) {
        // Attempt to sign in with provided email and password
        const { error } = await signUp(
            "email-signup",
            values.email,
            values.password,
        );

        if (error) {
            // Display and log any sign-in errors
            console.log(error);
            toast.error(t("toast.auth.error"));
        } else {
            postSignUp();
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSignUpWithEmail)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormInputField
                            field={field}
                            inputType="email"
                            placeholder={t("ui.auth.email")}
                            formLabel={t("ui.auth.email")}
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
                            formLabel={t("ui.auth.password")}
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
                            formLabel={t("ui.auth.confirmPassword")}
                        />
                    )}
                />
                <Button type="submit">{t("ui.auth.signUp")}</Button>
            </form>
        </Form>
    );
}

export default SignUpWithEmail;
