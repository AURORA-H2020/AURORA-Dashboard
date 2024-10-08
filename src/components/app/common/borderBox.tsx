import { cn } from "@/lib/utilities";

/**
 * Renders a border box component with rounded corners and a border.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be rendered inside the border box.
 * @param {string} [props.className] - The additional CSS class name for the component.
 * @return {React.ReactNode} The rendered border box component.
 */
const BorderBox = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): React.ReactNode => {
    return (
        <div className={cn(className, "rounded-lg border p-4")}>
            <div className="space-y-4">{children}</div>
        </div>
    );
};

export { BorderBox };
