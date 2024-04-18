import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utilities";
import { useId, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

type InputTypes = "number" | "text" | "email";

const FormInputField = ({
    field,
    inputType,
    placeholder,
    label,
    description,
    className,
    showSwitch,
    unit,
    optOutLabel,
    disabled = false,
}: {
    field: ControllerRenderProps<any, any>;
    inputType: InputTypes;
    placeholder: string;
    label?: string;
    description?: string;
    className?: string;
    showSwitch?: boolean;
    unit?: string;
    optOutLabel?: string;
    disabled?: boolean;
}) => {
    const [disableField, setDisableField] = useState<boolean>(false);
    const [visible, setVisible] = useState(
        showSwitch ? (field.value ? true : false) : true,
    );

    const labelId = useId();

    const handleSwitchChange = (state: boolean) => {
        if (state) {
            setVisible(true);
        } else {
            setVisible(false);
            clearField();
        }
    };

    const handleCheckChange = (checked: boolean) => {
        if (checked) {
            clearField();
        }

        setDisableField(checked);
    };

    const clearField = () => {
        field.value = undefined;
        field.onChange(undefined);
    };

    return (
        <FormItem className={cn(className)}>
            {showSwitch ? (
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={visible}
                        onCheckedChange={handleSwitchChange}
                        id={field.name}
                    />
                    <FormLabel htmlFor={field.name}>{label}</FormLabel>
                </div>
            ) : (
                label && <FormLabel>{label}</FormLabel>
            )}
            {visible && (
                <FormControl>
                    <div className="relative">
                        <Input
                            type={inputType}
                            placeholder={placeholder}
                            {...field}
                            value={field.value ?? ""}
                            disabled={disableField || disabled}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-md"
                        />
                        {unit && (
                            <div className="absolute inset-y-0 right-0 pr-0 flex items-center cursor-pointer">
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-muted-foreground font-mono border-l min-w-14 h-full p-1 rounded-l-none">
                                    {unit}
                                </div>
                            </div>
                        )}
                    </div>
                </FormControl>
            )}
            {optOutLabel && (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={labelId}
                        disabled={disabled}
                        onCheckedChange={handleCheckChange}
                    />
                    <label
                        htmlFor={labelId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {optOutLabel}
                    </label>
                </div>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
        </FormItem>
    );
};

export default FormInputField;
