import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utilities";
import { ControllerRenderProps } from "react-hook-form";

const FormSwitch = ({
    field,
    label,
    description,
    disabled = false,
    className,
}: {
    field: ControllerRenderProps<any, any>;
    label?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
}) => (
    <FormItem
        className={cn(
            className,
            "flex flex-row items-center justify-between rounded-lg border p-4",
        )}
    >
        <div className="space-y-0.5">
            {label && <FormLabel className="text-base">{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
        </div>
        <FormControl>
            <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
            />
        </FormControl>
        <FormMessage />
    </FormItem>
);

export default FormSwitch;
