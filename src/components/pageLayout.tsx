import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
    children?: ReactNode;
    title: ReactNode;
};

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
