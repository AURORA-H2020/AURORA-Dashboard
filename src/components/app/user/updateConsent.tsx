import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { setAcceptedLegalDocumentVersion } from "@/firebase/user/setAcceptedLegalDocumentVersion";
import { Flex, Heading } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { Info } from "lucide-react";
import Link from "next/link";
import DeleteAccountModal from "../common/deleteAccountModal";

const UpdateConsent = ({
    latestLegalDocumentsVersion,
    user,
}: {
    latestLegalDocumentsVersion: number;
    user: User;
}) => {
    return (
        <Flex justify={"center"}>
            <Card className="w-[600px]">
                <CardHeader>
                    <Flex
                        justify="between"
                        align={{ initial: "start", xs: "center" }}
                        direction="column"
                        className="gap-2"
                    >
                        <Info size={50} />
                        <Heading weight="bold">Important</Heading>
                    </Flex>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Flex direction="column" gap="4">
                        <div className="w-[400px] text-center">
                            We have updated our Privacy Policy and Terms of
                            Service. Please review and accept the latest version
                            to continue using the app.
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="https://www.aurora-h2020.eu/aurora/app-privacy-policy/">
                                Privacy Policy
                            </Link>
                        </Button>
                        <Button variant="outline">
                            <Link href="https://www.aurora-h2020.eu/aurora/app-tos/">
                                Terms of Service
                            </Link>
                        </Button>
                    </Flex>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                    <DeleteAccountModal
                        title="Warning!"
                        description="Rejecting the latest Privacy Policy and Terms of Services requires us to delete your account. Note that we cannot recover your account after deleting it."
                    >
                        <Button variant="destructive">Reject</Button>
                    </DeleteAccountModal>
                    <Button
                        onClick={() =>
                            setAcceptedLegalDocumentVersion(
                                latestLegalDocumentsVersion,
                                user,
                            )
                        }
                    >
                        Accept
                    </Button>
                </CardFooter>
            </Card>
        </Flex>
    );
};

export default UpdateConsent;
