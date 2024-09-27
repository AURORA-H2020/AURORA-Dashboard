import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerCalendar } from "@/components/ui/time-picker-input";
import { cn } from "@/lib/utilities";
import { Timestamp } from "firebase/firestore";
import { CalendarIcon, XIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { ControllerRenderProps } from "react-hook-form";

/**
 * FormDatePicker component.
 *
 * This component is a DatePicker input field that can be used in a Form.
 * It renders a Popover with a Calendar inside to select a date.
 * Optionally, it can also render a TimePicker below the Calendar.
 *
 * @param field - The ControllerRenderProps returned from `useController`
 * @param placeholder - The placeholder string to display when no date is selected
 * @param label - The label to display above the input field
 * @param description - The description to display below the input field
 * @param showTimePicker - Whether or not to show a TimePicker below the Calendar (defaults to false)
 * @param showClearButton - Whether or not to show a clear button to clear the selected date (defaults to false)
 * @param minDate - The minimum selectable date (defaults to 1990-01-01)
 * @param maxDate - The maximum selectable date (defaults to 2030-01-01)
 * @param className - Additional CSS class names to apply to the component
 */
const FormDatePicker = ({
  field,
  placeholder,
  label,
  description,
  showTimePicker = false,
  showClearButton = false,
  minDate = new Date("1990-01-01"),
  maxDate = new Date("2030-01-01"),
  className,
  required = false,
}: {
  field: ControllerRenderProps<any, any>;
  placeholder: string;
  label?: string;
  description?: string;
  showTimePicker?: boolean;
  showClearButton?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  required?: boolean;
}) => {
  const format = useFormatter();

  return (
    <FormItem className={cn(className)}>
      {label && (
        <FormLabel>
          {label}
          {required && <span className="bold text-muted-foreground"> *</span>}
        </FormLabel>
      )}
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground",
              )}
            >
              {field.value ? (
                format.dateTime(field.value.toDate(), {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  ...(showTimePicker
                    ? { hour: "numeric", minute: "numeric" }
                    : {}),
                })
              ) : (
                <span>{placeholder}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              {showClearButton && field.value && (
                <XIcon
                  className="ml-2 h-4 w-4 cursor-pointer opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange(null);
                  }}
                />
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            fixedWeeks
            mode="single"
            selected={field.value?.toDate()}
            defaultMonth={field.value?.toDate()}
            onSelect={(date) => {
              const selectedDate = date ? date : new Date();

              selectedDate.setHours(
                field.value?.toDate().getHours() || 0,
                field.value?.toDate().getMinutes() || 0,
              );

              const timestamp = Timestamp.fromDate(selectedDate);
              field.onChange(timestamp);
            }}
            disabled={(date) => date > maxDate || date < minDate}
            initialFocus
          />
          {showTimePicker && (
            <div className="border-t border-border p-3">
              <TimePickerCalendar
                setDate={(date) => {
                  const timestamp = Timestamp.fromDate(date || new Date());
                  field.onChange(timestamp);
                }}
                date={field.value?.toDate()}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export { FormDatePicker };
