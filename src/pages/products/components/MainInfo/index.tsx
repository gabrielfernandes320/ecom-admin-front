import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Grid,
    Input,
    Switch,
} from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IProduct } from "../../../../interfaces/product/product";

const MainInfo: React.FC = () => {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<IProduct>();

    return (
        <Box>
            <Box>
                <Grid
                    templateColumns={[
                        "repeat(1, 1fr)",
                        "repeat(1, 1fr)",
                        "repeat(2, 1fr)",
                    ]}
                    gap={6}
                >
                    <FormControl isInvalid={!!errors.name}>
                        <FormLabel>Name</FormLabel>
                        <Input
                            id="name"
                            type="name"
                            placeholder="Jonh Doe"
                            {...register("name", {
                                required: "This is required",
                            })}
                        />
                        <FormErrorMessage>
                            {errors.name && errors.name.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.description}>
                        <FormLabel>Description</FormLabel>
                        <Input
                            id="email"
                            placeholder="your@email.com"
                            {...register("description", {
                                required: "This is required",
                            })}
                        />
                        <FormErrorMessage>
                            {errors.description && errors.description.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.price}>
                        <FormLabel>Price</FormLabel>
                        <Input
                            id="email"
                            placeholder="your@email.com"
                            {...register("price", {
                                required: "This is required",
                            })}
                        />
                        <FormErrorMessage>
                            {errors.price && errors.price.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.enabled}>
                        <FormLabel>Enabled</FormLabel>
                        <Controller
                            control={control}
                            name="enabled"
                            render={({ field }) => (
                                <Switch
                                    size={"lg"}
                                    onChange={(e) =>
                                        field.onChange(e.target.checked)
                                    }
                                    isChecked={field.value}
                                />
                            )}
                        />

                        <FormErrorMessage>
                            {errors.enabled && errors.enabled.message}
                        </FormErrorMessage>
                    </FormControl>
                </Grid>
            </Box>
        </Box>
    );
};

export default MainInfo;
