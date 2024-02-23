import { FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Strong } from "@radix-ui/themes";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "../ui/button";
import { FormItem, FormLabel } from "../ui/form";

const FormPasswordField = ({
    field,
    placeholder,
    formLabel,
    showTogglePassword = false,
}: {
    field: ControllerRenderProps<any, any>;
    placeholder: string;
    formLabel: string;
    showTogglePassword?: boolean;
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormItem>
            <FormLabel>
                <Strong>{formLabel}</Strong>
            </FormLabel>
            <FormControl>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={placeholder}
                        {...field}
                    />
                    {showTogglePassword && (
                        <div className="absolute inset-y-0 right-0 pr-0 flex items-center cursor-pointer">
                            <Button
                                className="h-full w-12 p-1 rounded-l-none"
                                type="button"
                                variant={"outline"}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                    )}
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};

export default FormPasswordField;
