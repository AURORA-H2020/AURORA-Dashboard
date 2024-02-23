import { cn } from "@/lib/utilities";
import { Timestamp } from "firebase/firestore";
import { CalendarIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const FormDatePicker = ({ field, placeholder, formLabel }) => {
    const format = useFormatter();
    return (
        <FormItem>
            <FormLabel>{formLabel}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                            )}
                        >
                            {field.value ? (
                                format.dateTime(field.value.toDate())
                            ) : (
                                <span>{placeholder}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value.toDate()}
                        onSelect={(date) => {
                            const timestamp = Timestamp.fromDate(
                                date || new Date(),
                            );
                            field.onChange(timestamp);
                        }}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    );
};

export default FormDatePicker;
