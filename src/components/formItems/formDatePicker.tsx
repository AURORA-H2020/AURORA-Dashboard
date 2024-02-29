import { cn } from "@/lib/utilities";
import { Timestamp } from "firebase/firestore";
import { CalendarIcon, XIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ControllerRenderProps } from "react-hook-form";

const FormDatePicker = ({
    field,
    placeholder,
    label,
    showClearButton = false,
    minDate = new Date("1990-01-01"),
    maxDate = new Date("2030-01-01"),
}: {
    field: ControllerRenderProps<any, any>;
    placeholder: string;
    label?: string;
    showClearButton?: boolean;
    minDate?: Date;
    maxDate?: Date;
}) => {
    const format = useFormatter();

    return (
        <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover>
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
                                format.dateTime(field.value.toDate())
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
                            const timestamp = Timestamp.fromDate(
                                date || new Date(),
                            );
                            field.onChange(timestamp);
                        }}
                        disabled={(date) => date > maxDate || date < minDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    );
};

export default FormDatePicker;
