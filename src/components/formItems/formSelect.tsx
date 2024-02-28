import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormLabel, FormMessage } from "../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const FormSelect = ({
    field,
    options,
    placeholder,
    label,
    disabled = false,
}: {
    field: ControllerRenderProps<any, any>;
    options: { value: string; label: string }[];
    placeholder: string;
    label?: string;
    disabled?: boolean;
}) => (
    <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
        >
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <FormMessage />
    </FormItem>
);

export default FormSelect;
