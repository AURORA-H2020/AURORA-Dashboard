import {
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormLabel } from "../ui/form";
import MultipleSelector, { Option } from "../ui/multiple-selector";
import { useEffect, useState } from "react";

const FormMultiSelect = ({
    field,
    options,
    placeholder,
    label,
    description,
}: {
    field: ControllerRenderProps<any, any>;
    options: Option[];
    placeholder: string;
    label?: string;
    description?: string;
}) => {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    useEffect(() => {
        if (!field.value) return;

        const selectedOptions = options.filter((option) =>
            field.value.includes(Number(option.value)),
        );
        setSelectedOptions(selectedOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnChange = (selectedOptions: Option[]) => {
        setSelectedOptions(selectedOptions);
        const values = selectedOptions.map((option) => option.value);
        field.onChange(values);
    };

    return (
        <FormItem>
            {label && <FormLabel>{label}</FormLabel>}

            <FormControl>
                <MultipleSelector
                    value={selectedOptions}
                    onChange={handleOnChange}
                    defaultOptions={options}
                    className="bg-background w-full"
                    placeholder={placeholder}
                    hidePlaceholderWhenSelected={true}
                    badgeClassName="bg-secondary text-secondary-foreground"
                />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
        </FormItem>
    );
};

export default FormMultiSelect;
