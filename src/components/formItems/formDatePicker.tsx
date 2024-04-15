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
}) => {
    const format = useFormatter();

    return (
        <FormItem className={cn(className)}>
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
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
                                    className="ml-2 h-4 w-4 opacity-50 cursor-pointer"
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
                        <div className="p-3 border-t border-border">
                            <TimePickerCalendar
                                setDate={(date) => {
                                    const timestamp = Timestamp.fromDate(
                                        date || new Date(),
                                    );
                                    field.onChange(timestamp);
                                }}
                                date={field.value?.toDate()}
                            />
                        </div>
                    )}
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    );
};

export default FormDatePicker;
