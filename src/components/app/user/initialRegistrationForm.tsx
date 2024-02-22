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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import firebaseApp from "@/firebase/config";
import { genderMappings } from "@/lib/constants";
import { fetchUserById } from "@/lib/firebaseUtils";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

const formSchema = z.object({
    firstName: z.string().max(100, {
        message: "This field cannot exceed 100 characters.",
    }),
    lastName: z.string().max(100, {
        message: "This field cannot exceed 100 characters.",
    }),
    yearOfBirth: z.coerce
        .number()
        .min(1900, { message: "Please enter a valid year." })
        .max(2022, { message: "Please enter a valid year." }),
    gender: z.string(),
});

export default function UserProfileForm() {
    const t = useTranslations();

    const [userData, setUserData] = useState<FirebaseUser | null>(null);

    const { user } = useAuthContext() as {
        user: User;
    };

    // Fetch the user's profile data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await fetchUserById(user.uid);
            setUserData(userData);
        };

        fetchUserData();
    }, [user]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            firstName: userData?.firstName || "",
            lastName: userData?.lastName || "",
            yearOfBirth: userData?.yearOfBirth || 0,
            gender: userData?.gender || "",
        },
    });

    const onSubmit = async (data) => {
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            try {
                await setDoc(userRef, data, { merge: true });
                toast.success("Your profile was created successfully.");
            } catch (error) {
                console.error("Error writing document: ", error);
                toast.success("There was an error creating your profile.");
            }
        } else {
            toast.success("Please login to create a profile.");
        }
    };

    if (!user) {
        return <p>Please log in to update your profile.</p>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="First Name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last Name" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="yearOfBirth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year of Birth</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Please select your preferred gender" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {genderMappings.map((gender) => (
                                        <SelectItem
                                            key={gender.key}
                                            value={gender.key}
                                        >
                                            {t(gender.label)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <Button type="submit">Save Profile</Button>
            </form>
        </Form>
    );
}
