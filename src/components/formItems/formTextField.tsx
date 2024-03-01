import {
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utilities";
import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormLabel } from "../ui/form";
import { Textarea } from "../ui/textarea";

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
