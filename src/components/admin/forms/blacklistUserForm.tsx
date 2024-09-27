import { FormSelect } from "@/components/form-items/formSelect";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { blacklistUser } from "@/firebase/admin/handle-blacklist";
import { blacklistedReasonsList } from "@/lib/constants/admin-constants";
import { cn } from "@/lib/utilities";
import { blacklistUserFormSchema } from "@/lib/zod/admin/blacklistUserSchema";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { useAuthContext } from "@/providers/context/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { ReactNode } from "react";
import { DefaultValues, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Renders a form for blacklisting a user.
 *
 * @param {Object} props - The component props.
 * @param {string} props.blacklistUid - The UID of the user to be blacklisted.
 * @param {function} [props.onFormSubmit] - Optional callback function to be called when the form is submitted.
 * @param {string} [props.className] - Optional CSS class name for styling.
 * @return {ReactNode} The rendered form component.
 */
const BlacklistUserForm = ({
  blacklistUid,
  onFormSubmit,
  className,
}: {
  blacklistUid: string;
  onFormSubmit?: (_success: boolean) => void;
  className?: string;
}): ReactNode => {
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
        className={cn(className, "flex w-full flex-col gap-4")}
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

export { BlacklistUserForm };
