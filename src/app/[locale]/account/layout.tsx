import { Heading, Text } from "@radix-ui/themes";

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be rendered.
 * @return {React.ReactNode} The rendered AccountLayout component.
 */
export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    return (
        <>
            <Heading>My Account</Heading>
            <Text>
                Download your data or delete your account. We are working on
                implementing more features in the future.
            </Text>
            <div>{children}</div>
        </>
    );
}
