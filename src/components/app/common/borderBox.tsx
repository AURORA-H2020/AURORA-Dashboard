import { cn } from "@/lib/utilities";

const BorderBox = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(className, "rounded-lg border p-4")}>
            <div className="space-y-4">{children}</div>
        </div>
    );
};

export default BorderBox;
