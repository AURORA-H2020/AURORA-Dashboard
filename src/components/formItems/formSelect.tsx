import { Checkbox } from "@/components/ui/checkbox";
import {
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utilities";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

const FormSelect = ({
    field,
    options,
    placeholder,
    label,
    description,
    disabled = false,
    optOutLabel,
    className,
}: {
    field: ControllerRenderProps<any, any>;
    options: { value: string; label: string }[];
    placeholder: string;
    label?: string;
    description?: string;
    disabled?: boolean;
    optOutLabel?: string;
    className?: string;
}) => {
    const [selected, setSelected] = useState<string | undefined | null>(
        field.value || undefined,
    );

    const [disableField, setDisableField] = useState<boolean>(false);

    const handleSelectChange = (value: string) => {
        if (options.map((option) => option.value).includes(value)) {
            setSelected(value);
            field.onChange(value);
        } else {
            setSelected("");
            field.onChange(undefined);
        }
    };

    const handleCheckChange = (checked: boolean) => {
        if (checked) {
            setSelected("");
            field.onChange(undefined);
        }

        setDisableField(checked);
    };

    return (
        <FormItem className={cn(className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormDescription>{description}</FormDescription>
            <Select
                onValueChange={handleSelectChange}
                value={selected as string}
                disabled={disableField || disabled}
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
            {optOutLabel && (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={
                            label?.split(" ").join("-").toLowerCase() ??
                            optOutLabel
                        }
                        disabled={disabled}
                        onCheckedChange={handleCheckChange}
                    />
                    <label
                        htmlFor={
                            label?.split(" ").join("-").toLowerCase() ??
                            optOutLabel
                        }
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {optOutLabel}
                    </label>
                </div>
            )}
            <FormMessage />
        </FormItem>
    );
};

export default FormSelect;
