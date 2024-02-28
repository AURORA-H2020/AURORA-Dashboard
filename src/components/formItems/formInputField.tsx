import { FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormLabel } from "../ui/form";
import { cn } from "@/lib/utilities";

type InputTypes = "number" | "text" | "email";

const FormInputField = ({
    field,
    inputType,
    placeholder,
    label,
    className,
}: {
    field: ControllerRenderProps<any, any>;
    inputType: InputTypes;
    placeholder: string;
    label?: string;
    className?: string;
}) => (
    <FormItem className={cn(className)}>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
            <Input
                type={inputType}
                placeholder={placeholder}
                {...field}
                value={field.value ?? ""}
            />
        </FormControl>
        <FormMessage />
    </FormItem>
);

export default FormInputField;
