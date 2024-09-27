import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { TimePickerType } from "@/components/ui/time-picker-utils";
import { cn } from "@/lib/utilities";
import { ReactNode, useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

/**
 * Renders a form time picker component.
 *
 * @param field The field object for the form.
 * @param label The label text for the form field.
 * @param picker The type of time picker.
 * @param className The additional CSS class name for the component.
 * @returns The rendered form time picker component.
 */
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
}): ReactNode => {
  // The state for the selected date
  const [date, setDate] = useState<Date | undefined>(new Date());

  // When the component mounts, set the initial date
  useEffect(() => {
    if (!field.value) return;

    const date = new Date();
    if (picker === "hours") date.setHours(field.value);
    if (picker === "minutes") date.setMinutes(field.value);
    if (picker === "seconds") date.setSeconds(field.value);

    setDate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handles time changes.
   *
   * @param date The selected date.
   */
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
        <TimePickerInput picker={picker} date={date} setDate={handleOnChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export { FormTimePicker };
