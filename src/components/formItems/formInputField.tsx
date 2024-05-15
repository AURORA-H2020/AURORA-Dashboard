import { Checkbox } from "@/components/ui/checkbox";
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

type InputTypes = "number" | "text" | "email";

/**
 * Renders a form input field component.
 *
 * @param {ControllerRenderProps<any, any>} field - The field object for the form.
 * @param {InputTypes} inputType - The type of input field.
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} [label] - The label text for the form field.
 * @param {string} [description] - The description text for the form field.
 * @param {string} [className] - The additional CSS class name for the component.
 * @param {boolean} [showSwitch] - Determines if a switch is shown.
 * @param {string} [unit] - The unit for the input field.
 * @param {string} [optOutLabel] - The label for opting out.
 * @param {boolean} [disabled=false] - Indicates if the field is disabled.
 * @return {React.ReactNode} The rendered form input field component.
 */
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
    required = false,
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
    required?: boolean;
}): React.ReactNode => {
    const [disableField, setDisableField] = useState<boolean>(false);
    const [visible, setVisible] = useState(
        showSwitch ? (field.value ? true : false) : true,
    );

    const labelId = useId();

    /**
     * Handles the switch change event.
     *
     * @param {boolean} state - The state of the switch.
     */
    const handleSwitchChange = (state: boolean) => {
        if (state) {
            setVisible(true);
        } else {
            setVisible(false);
            clearField();
        }
    };

    /**
     * Handles the check change event.
     *
     * @param {boolean} checked - The state of the check.
     * @return {void} No return value.
     */
    const handleCheckChange = (checked: boolean) => {
        if (checked) {
            clearField();
        }

        setDisableField(checked);
    };

    /**
     * Clears the field by setting its value to undefined and calling the onChange function with undefined as the argument.
     *
     * @return {void} This function does not return anything.
     */
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
                label && (
                    <FormLabel>
                        {label}
                        {required && (
                            <span className="bold text-muted-foreground">
                                {" "}
                                *
                            </span>
                        )}
                    </FormLabel>
                )
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
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-md md:text-sm"
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

export { FormInputField };
