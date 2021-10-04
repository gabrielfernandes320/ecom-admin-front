import { CheckIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useToast,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import TopInfoBar from "../../../components/navigation/TopInfoBar";
import PermissionsGate from "../../../components/permissions/PermissionsGate";
import { UserPermissions } from "../../../enums/permissions";
import { IUser } from "../../../interfaces/user/user";
import { usersRoutePath } from "../../../routes/config";
import UserHttpService from "../../../services/http/user-http";
import MainInfo from "../components/MainInfo";
export const Detail: React.FC = () => {
    const toast = useToast();
    const methods = useForm<IUser>({
        defaultValues: { enabled: true },
    });
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;
    useQuery("user", LoadUser, {
        enabled: isEditing,
    });

    async function LoadUser() {
        const { data: user }: AxiosResponse = await UserHttpService.show(id);

        user.roles = user.roles[0].id;
        methods.reset(user);

        return user;
    }

    const mutation = useMutation(
        async (data: IUser) => {
            await UserHttpService.store(data);
        },
        {
            onError: (error: any) => {
                error.message?.map((message: string) =>
                    toast({
                        title: message,
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                    })
                );
            },
            onSuccess: () => {
                toast({
                    title: "Sucess at saving the user.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
                history.push(usersRoutePath);
            },
        }
    );

    const onSubmit: SubmitHandler<IUser> = (data: IUser) => {
        mutation.mutate(data);
    };

    return (
        <>
            <TopInfoBar
                title={methods.getValues().name}
                subtitle={"All the user information."}
                Buttons={[
                    <PermissionsGate
                        allowedPermissions={[
                            isEditing
                                ? UserPermissions.Update
                                : UserPermissions.Create,
                        ]}
                    >
                        <Button
                            onClick={methods.handleSubmit(onSubmit)}
                            type={"submit"}
                            leftIcon={
                                mutation.isLoading ? <Spinner /> : <CheckIcon />
                            }
                            alignContent={"flex-end"}
                        >
                            Save
                        </Button>
                    </PermissionsGate>,
                ]}
            />

            <Box pr={"9"} pl={"9"}>
                <Tabs>
                    <TabList>
                        <Tab>Main Informations</Tab>
                    </TabList>
                    <FormProvider {...methods}>
                        <TabPanels>
                            <TabPanel>
                                <MainInfo />
                            </TabPanel>
                        </TabPanels>
                    </FormProvider>
                </Tabs>
            </Box>
        </>
    );
};
