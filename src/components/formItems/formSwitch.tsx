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

/**
 * Renders a form switch component.
 *
 * @param {ControllerRenderProps<any, any>} field - The field object for the form.
 * @param {string} [label] - The label text for the form switch.
 * @param {string} [description] - The description text for the form switch.
 * @param {boolean} [disabled=false] - Determines if the switch is disabled.
 * @param {string} [className] - The additional CSS class name for the component.
 * @return {React.ReactNode} The rendered form switch component.
 */
const FormSwitch = ({
    field,
    label,
    description,
    disabled = false,
    className,
    required = false,
}: {
    field: ControllerRenderProps<any, any>;
    label?: string;
    description?: string;
    disabled?: boolean;
    className?: string;
    required?: boolean;
}): React.ReactNode => (
    <FormItem
        className={cn(
            className,
            "flex flex-row items-center justify-between rounded-lg border p-4",
        )}
    >
        <div className="space-y-0.5">
            {label && (
                <FormLabel className="text-base">
                    {label}
                    {required && (
                        <span className="bold text-muted-foreground"> *</span>
                    )}
                </FormLabel>
            )}
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

export { FormSwitch };
