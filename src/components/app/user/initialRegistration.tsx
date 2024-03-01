import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { deleteAccount } from "@/firebase/firestore/deleteAccount";
import { Flex, Heading } from "@radix-ui/themes";
import UserDataForm from "./forms/userDataForm";

const InitialRegistration = () => {
    const { user } = useAuthContext();

    const { userData } = useFirebaseData();

    return (
        <Flex justify={"center"}>
            <Card className="w-[600px]">
                <CardHeader>
                    <Flex
                        justify="between"
                        align={{ initial: "start", xs: "center" }}
                        direction={{ initial: "column", xs: "row" }}
                        className="gap-2"
                    >
                        <Heading weight="bold">
                            Please create your account
                        </Heading>

                        <Button
                            variant="destructive"
                            onClick={() => deleteAccount(user)}
                        >
                            Delete account
                        </Button>
                    </Flex>
                </CardHeader>
                <CardContent>
                    <UserDataForm userData={userData} isNewUser={true} />
                </CardContent>
            </Card>
        </Flex>
    );
};

export default InitialRegistration;
