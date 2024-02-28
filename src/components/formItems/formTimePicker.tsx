import { FormControl, FormMessage } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { FormItem, FormLabel } from "../ui/form";
import { TimePickerInput } from "../ui/time-picker-input";
import { TimePickerType } from "../ui/time-picker-utils";

const FormTimePicker = ({
    field,
    label,
    picker,
}: {
    field: ControllerRenderProps<any, any>;
    label?: string;
    picker: TimePickerType;
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
        <FormItem>
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
