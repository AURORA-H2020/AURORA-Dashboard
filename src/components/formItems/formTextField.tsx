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
}) => (
    <FormItem className={cn(className)}>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
            <Textarea
                placeholder={placeholder}
                className="resize-none"
                {...field}
            />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
    </FormItem>
);

export default FormTextField;
