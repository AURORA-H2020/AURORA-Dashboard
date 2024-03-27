import {
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utilities";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormLabel } from "../ui/form";
import { Switch } from "../ui/switch";

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
}: {
    field: ControllerRenderProps<any, any>;
    inputType: InputTypes;
    placeholder: string;
    label?: string;
    description?: string;
    className?: string;
    showSwitch?: boolean;
    unit?: string;
}) => {
    const [visible, setVisible] = useState(
        showSwitch ? (field.value ? true : false) : true,
    );

    const handleCheckedChange = (state: boolean) => {
        if (state) {
            setVisible(true);
        } else {
            setVisible(false);
            field.value = undefined;
            field.onChange(undefined);
        }
    };

    return (
        <FormItem className={cn(className)}>
            {showSwitch ? (
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={visible}
                        onCheckedChange={handleCheckedChange}
                        id={field.name}
                    />
                    <FormLabel htmlFor={field.name}>{label}</FormLabel>
                </div>
            ) : (
                label && <FormLabel>{label}</FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            {visible && (
                <FormControl>
                    <div className="relative">
                        <Input
                            type={inputType}
                            placeholder={placeholder}
                            {...field}
                            value={field.value ?? ""}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

            <FormMessage />
        </FormItem>
    );
};

export default FormInputField;
