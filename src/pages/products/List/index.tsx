import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    Button,
    Center,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Switch,
    Text,
    useToast,
} from "@chakra-ui/react";
import { AxiosResponse } from "axios";
import { DateTime } from "luxon";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { Column } from "react-table";
import Table from "../../../components/data-display/Table";
import TopInfoBar from "../../../components/navigation/TopInfoBar";
import PermissionsGate from "../../../components/permissions/PermissionsGate";
import { ProductPermissions } from "../../../enums/permissions";
import { IProduct } from "../../../interfaces/product/product";
import {
    productsNewRoutePath,
    productsRoutePath,
} from "../../../routes/config";
import { useProductHttpService } from "../../../services/http/product-http";

export const List: React.FC = () => {
    const toast = useToast();
    const history = useHistory();
    const { destroy, index, show, store, update } = useProductHttpService();

    const { data: products, refetch } = useQuery(["products"], async () => {
        const { data }: AxiosResponse = await index();

        return data.value;
    });

    const destroyMutation = useMutation(
        async (id: number) => {
            await destroy(id);
        },
        {
            onError: (error: any) => {
                toast({
                    title: "Error at deleting the product.",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                });
            },
            onSuccess: () => {
                toast({
                    title: "Sucess at deleting the product.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            },
        }
    );

    const updateMutation = useMutation(
        async (data: IProduct) => {
            await update(data);
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
                    title: "Sucess at updating the product.",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            },
        }
    );

    const memoData: IProduct[] = React.useMemo(() => products, [products]);

    const columns: Column[] = React.useMemo(
        () => [
            {
                Header: "Id",
                accessor: "id",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Description",
                accessor: "description",
            },
            {
                Header: "Price",
                accessor: "price",
            },
            {
                Header: "Created At",
                accessor: ({ createdAt }: any) =>
                    DateTime.fromISO(createdAt).toLocaleString(),
            },

            {
                Header: "Enabled",
                accessor: "enabled",
                Cell: (props: any) => (
                    <PermissionsGate
                        allowedPermissions={[ProductPermissions.Update]}
                        noAccessProps={{ isDisabled: true }}
                    >
                        <Switch
                            size={"lg"}
                            onChange={async () => {
                                const data: IProduct = props.row.original;
                                data.enabled = !data.enabled;
                                await updateMutation.mutateAsync(data);
                                await refetch();
                            }}
                            isChecked={props.row.original.enabled}
                        />
                    </PermissionsGate>
                ),
            },

            {
                Header: "Actions",
                accessor: "action",
                Cell: (props: any) => (
                    <Menu>
                        <PermissionsGate
                            allowedPermissions={[
                                ProductPermissions.Delete,
                                ProductPermissions.Update,
                            ]}
                            noAccessProps={{ disabled: true }}
                        >
                            <MenuButton
                                as={IconButton}
                                variant={"ghost"}
                                icon={<HamburgerIcon />}
                            />
                        </PermissionsGate>

                        <MenuList>
                            <PermissionsGate
                                allowedPermissions={[ProductPermissions.Update]}
                            >
                                <MenuItem
                                    as={Link}
                                    to={`${productsRoutePath}/${props.row.original.id}/edit`}
                                >
                                    Edit
                                </MenuItem>
                            </PermissionsGate>

                            <PermissionsGate
                                allowedPermissions={[ProductPermissions.Delete]}
                            >
                                <MenuItem
                                    onClick={async () => {
                                        await destroyMutation.mutateAsync(
                                            +props.row.original.id
                                        );
                                        refetch();
                                    }}
                                >
                                    Delete
                                </MenuItem>
                            </PermissionsGate>
                        </MenuList>
                    </Menu>
                ),
            },
        ],
        [destroyMutation, refetch, updateMutation]
    );

    return (
        <>
            <TopInfoBar
                title={"Products"}
                subtitle={"All your products in one place."}
                Buttons={[
                    <PermissionsGate
                        allowedPermissions={[ProductPermissions.Create]}
                    >
                        <Button
                            onClick={() => history.push(productsNewRoutePath)}
                            leftIcon={<AddIcon />}
                            alignContent={"flex-end"}
                        >
                            New Product
                        </Button>
                    </PermissionsGate>,
                ]}
            />
            <PermissionsGate
                renderNoAccess={
                    <Center>
                        <Text fontSize={"xl"}>
                            You don`t have access to see this.
                        </Text>
                    </Center>
                }
                allowedPermissions={[ProductPermissions.List]}
            >
                <Table columns={columns} data={memoData ?? []} />
            </PermissionsGate>
        </>
    );
};
