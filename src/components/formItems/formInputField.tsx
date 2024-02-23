import { FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormLabel } from "../ui/form";

type InputTypes = "number" | "text" | "email";

const FormInputField = ({
    field,
    inputType,
    placeholder,
    formLabel,
}: {
    field: ControllerRenderProps<any, any>;
    inputType: InputTypes;
    placeholder: string;
    formLabel: string;
}) => (
    <FormItem>
        <FormLabel>{formLabel}</FormLabel>
        <FormControl>
            <Input type={inputType} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
    </FormItem>
);

export default FormInputField;
