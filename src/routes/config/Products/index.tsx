import React from "react";
import { Switch } from "react-router-dom";
import { Detail, List } from "../../../pages/products";
import PrivateRoute from "../../components/PrivateRoute";

export const productsRoutePath = "/products";
export const productsDetailRoutePath = "/products/:id/edit";
export const productsNewRoutePath = "/products/new";

export const ProductsRoutesComponent: React.FC = () => (
    <Switch>
        <PrivateRoute path={productsRoutePath} component={List} exact />
        <PrivateRoute path={productsNewRoutePath} component={Detail} exact />
        <PrivateRoute path={productsDetailRoutePath} component={Detail} exact />
    </Switch>
);
