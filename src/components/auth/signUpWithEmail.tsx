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
import signUp from "@/firebase/auth/authentication";
import { Strong } from "@radix-ui/themes";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
});

/**
 * Function for signing up with email.
 *
 * @param {z.infer<typeof formSchema>} values - the form values
 * @return {JSX.Element} the sign up form
 */
function SignUpWithEmail(): JSX.Element {
    const router = useRouter();

    /* TODO: Add Password confirmation and validation (password strength) */
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /**
     * Function for handling user sign-up.
     */
    const postSignUp = () => {
        toast.success("Welcome to AURORA!");
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
                        <FormItem>
                            <FormLabel>
                                <Strong>Email</Strong>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Email"
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
                                <Strong>Password</Strong>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={"password"}
                                        placeholder="Password"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Sign up</Button>
            </form>
        </Form>
    );
}

export default SignUpWithEmail;
