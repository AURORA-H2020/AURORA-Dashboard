"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

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
import { Flex, Strong } from "@radix-ui/themes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import signUp from "@/firebase/auth/signUp";

const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
});

function SignUpForm(): JSX.Element {
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Attempt to sign in with provided email and password
        const { result, error } = await signUp(values.email, values.password);

        if (error) {
            // Display and log any sign-in errors
            console.log(error);
            return;
        }

        // Redirect to the account page
        router.push("/account");
    }

    return (
        <Flex justify={"center"}>
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Sign up</CardTitle>
                    <CardDescription>
                        Create your AURORA Energy Tracker account.
                        <br />
                        Already have an account? Sign in{" "}
                        <Link href="/signin">
                            <Strong>here</Strong>.
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
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
                </CardContent>
            </Card>
        </Flex>
    );
}

export default SignUpForm;
