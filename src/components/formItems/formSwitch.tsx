import { ControllerRenderProps } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";

const FormSwitch = ({
    field,
    label,
    description,
    disabled = false,
}: {
    field: ControllerRenderProps<any, any>;
    label?: string;
    description?: string;
    disabled?: boolean;
}) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
