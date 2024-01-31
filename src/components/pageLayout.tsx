import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
    children?: ReactNode;
    title: ReactNode;
};

/**
 * Renders a page layout with a title and content.
 *
 * @param {Object} children - the content to display in the layout
 * @param {string} title - the title of the page
 * @return {JSX.Element} the rendered page layout
 */
export default function PageLayout({ children, title }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
