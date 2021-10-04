import React from "react";
import { Route, Switch } from "react-router-dom";
import NavBar from "../components/navigation/NavBar";
import {
    accountRecoveryRoutePath,
    AuthRoutesComponent,
    changePasswordRoutePath,
    homeRoutePath,
    HomeRoutesComponent,
    loginRoutePath,
    NotFoundRoutesComponent,
    ProductsRoutesComponent,
    RolesRoutesComponent,
    UsersRoutesComponent,
} from "./config";

const AppRoutes: React.FC = () => (
    <Switch>
        <Route path={loginRoutePath} component={AuthRoutesComponent} />
        <Route
            path={accountRecoveryRoutePath}
            component={AuthRoutesComponent}
        />
        <Route path={changePasswordRoutePath} component={AuthRoutesComponent} />

        <NavBar>
            <Route path={homeRoutePath} component={HomeRoutesComponent} />
            <UsersRoutesComponent />
            <RolesRoutesComponent />
            <ProductsRoutesComponent />
        </NavBar>
        <Route component={NotFoundRoutesComponent} />
    </Switch>
);

export default AppRoutes;
