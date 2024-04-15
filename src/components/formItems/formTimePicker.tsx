import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { TimePickerType } from "@/components/ui/time-picker-utils";
import { cn } from "@/lib/utilities";
import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

const FormTimePicker = ({
    field,
    label,
    picker,
    className,
}: {
    field: ControllerRenderProps<any, any>;
    label?: string;
    picker: TimePickerType;
    className?: string;
}) => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    useEffect(() => {
        if (!field.value) return;

        const date = new Date();
        if (picker === "hours") date.setHours(field.value);
        if (picker === "minutes") date.setMinutes(field.value);
        if (picker === "seconds") date.setSeconds(field.value);

        setDate(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnChange = (date: Date | undefined) => {
        setDate(date);
        let timeValue: number | undefined = undefined;

        if (picker === "hours") timeValue = date?.getHours();
        if (picker === "minutes") timeValue = date?.getMinutes();
        if (picker === "seconds") timeValue = date?.getSeconds();

        field.onChange(timeValue);
    };

    return (
        <FormItem className={cn(className)}>
            {label && <FormLabel className="text-xs">{label}</FormLabel>}
            <FormControl>
                <TimePickerInput
                    picker={picker}
                    date={date}
                    setDate={handleOnChange}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export default FormTimePicker;
