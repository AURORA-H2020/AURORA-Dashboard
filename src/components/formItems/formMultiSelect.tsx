import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { cn } from "@/lib/utilities";
import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

/**
 * Renders a form component for selecting multiple options.
 *
 * @param {ControllerRenderProps<any, any>} field - The field object from react-hook-form.
 * @param {Option[]} options - The available options for selection.
 * @param {string} placeholder - The placeholder text for the input.
 * @param {string} [label] - The label text for the form item.
 * @param {string} [description] - The description text for the form item.
 * @param {string} [className] - The additional class name for the form item.
 * @return {React.ReactNode} The rendered form component.
 */
const FormMultiSelect = ({
    field,
    options,
    placeholder,
    label,
    description,
    className,
}: {
    field: ControllerRenderProps<any, any>;
    options: Option[];
    placeholder: string;
    label?: string;
    description?: string;
    className?: string;
}): React.ReactNode => {
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
        <FormItem className={cn(className)}>
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
