"use client";
import signIn from "@/firebase/auth/signIn";

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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Flex, Strong } from "@radix-ui/themes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
});

function SignInForm() {
    const router = useRouter();
    const { toast } = useToast();

    const [showPassword, setShowPassword] = useState(false);

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
        const { result, error } = await signIn(values.email, values.password);

        if (error) {
            // Display and log any sign-in errors
            console.log(error);
            return;
        }

        toast({
            title: "Successfully signed in",
            description: "Welcome back!",
        });

        // Redirect to the account page
        router.push("/account");
    }

    return (
        <Flex justify={"center"}>
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Sign in to your AURORA Energy Tracker account.
                        <br />
                        Don&apos;t have an account yet? Register{" "}
                        <Link href="/signup">
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
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Password"
                                                    {...field}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-0 flex items-center cursor-pointer">
                                                    <Button
                                                        className="h-full w-12 p-1 rounded-l-none"
                                                        variant={"outline"}
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
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
                            <Button type="submit">Sign in</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </Flex>
    );
}

export default SignInForm;
