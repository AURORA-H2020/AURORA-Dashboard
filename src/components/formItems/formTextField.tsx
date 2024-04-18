import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utilities";
import { ControllerRenderProps } from "react-hook-form";

/**
 * Renders a form text field component.
 *
 * @param {ControllerRenderProps<any, any>} field - The field object for the form.
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} [label] - The label text for the form field.
 * @param {string} [description] - The description text for the form field.
 * @param {string} [className] - The additional CSS class name for the component.
 * @return {React.ReactNode} The rendered form text field component.
 */
const FormTextField = ({
    field,
    placeholder,
    label,
    description,
    className,
}: {
    field: ControllerRenderProps<any, any>;
    placeholder: string;
    label?: string;
    description?: string;
    className?: string;
}): React.ReactNode => (
    <FormItem className={cn(className)}>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
            <Textarea
                placeholder={placeholder}
                className="resize-none text-md"
                {...field}
            />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
    </FormItem>
);

export default FormTextField;
