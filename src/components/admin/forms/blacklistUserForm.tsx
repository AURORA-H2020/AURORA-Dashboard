import FormSelect from "@/components/formItems/formSelect";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { useAuthContext } from "@/context/AuthContext";
import { blacklistUser } from "@/firebase/admin/handleBlacklist";
import { blacklistedReasonsList } from "@/lib/constants/admin";
import { cn } from "@/lib/utilities";
import { blacklistUserFormSchema } from "@/lib/zod/admin/blacklistUserSchema";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const BlacklistUserForm = ({
    blacklistUid,
    onFormSubmit,
    className,
}: {
    blacklistUid: string;
    onFormSubmit?: (success: boolean) => void;
    className?: string;
}) => {
    const formSchema = blacklistUserFormSchema;

    const { user } = useAuthContext() as {
        user: User;
    };

    const initialFormData: DefaultValues<BlacklistedUser> = {
        blacklistedReason: undefined,
        blacklistedAt: Timestamp.now(),
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialFormData,
    });

    const onSubmit = async (data: BlacklistedUser) => {
        const { success } = await blacklistUser(user, blacklistUid, data);
        if (success) {
            toast.success("User was blacklisted successfully.");
        } else {
            toast.error("There was an error blacklisting this user.");
        }

        if (onFormSubmit) {
            onFormSubmit(success);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, "flex flex-col gap-4 w-full")}
            >
                <FormField
                    control={form.control}
                    name="blacklistedReason"
                    render={({ field }) => (
                        <FormSelect
                            field={field}
                            options={blacklistedReasonsList.map((reason) => ({
                                value: reason.key,
                                label: reason.name,
                            }))}
                            placeholder="Select a reason"
                            label="Blacklist Reason"
                        />
                    )}
                />

                <DialogFooter className="flex sm:justify-between">
                    <Button type="submit" variant="destructive">
                        Blacklist
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

export default BlacklistUserForm;
