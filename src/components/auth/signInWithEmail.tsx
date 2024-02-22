import authenticate from "@/firebase/auth/authentication";

import { useRouter } from "@/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Strong } from "@radix-ui/themes";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
});

/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
function SignInWithEmail() {
    const router = useRouter();
    const t = useTranslations();

    const [showPassword, setShowPassword] = useState(false);

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
        router.push("/account");
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
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <Strong>{t("ui.auth.email")}</Strong>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder={t("ui.auth.email")}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                <Strong>{t("ui.auth.password")}</Strong>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder={t("ui.auth.password")}
                                        {...field}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-0 flex items-center cursor-pointer">
                                        <Button
                                            className="h-full w-12 p-1 rounded-l-none"
                                            type="button"
                                            variant={"outline"}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff />
                                            ) : (
                                                <Eye />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{t("ui.auth.signIn")}</Button>
            </form>
        </Form>
    );
}

export default SignInWithEmail;
