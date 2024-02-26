import { FormItem, FormLabel, FormMessage } from "../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const FormSelect = ({ field, options, placeholder, formLabel }) => (
    <FormItem>
        <FormLabel>{formLabel}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
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
