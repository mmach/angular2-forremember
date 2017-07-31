import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Routes, RouterModule } from "@angular/router";
import { Type } from "@angular/core";

import { AuthenticationGuard } from "./guards/authenticationguard.service";
import { AdminGuard } from "./guards/adminguard.service";

import { AdministrationComponent } from "./administration/administration.component";
import { AuthorizationComponent } from "./users/authorization";
import { ConceptAddComponent } from "./concepts/concept-add/concept-add.component";
import { ConceptEditComponent } from "./concepts/concept-edit/concept-edit.component";
import { ConceptProduceComponent } from "./concepts/concept-produce/concept-produce.component";
import { ConceptListComponent } from "./concepts/concept-list/concept-list.component";
import { ConceptSplitComponent } from "./concepts/concept-split/concept-split.component";
import { ContainerAddComponent } from "./containers/container-add.component";
import { ContainerAddRangeComponent } from "./containers/container-addrange.component";
import { ContainersListComponent } from "./containers/containers-list.component";
import { CustomPropertiesComponent } from "./CustomProperties/customProperties.component";
import { HomeComponent } from "./home";
import { LocationFreezerManagerAddComponent } from "./locationFreezerManager/locationFreezerManager-add.component";
import { LocationFreezerManagerEditComponent } from "./locationFreezerManager/locationFreezerManager-edit.component";
import { LocationsBrowseComponent } from "./locations/locations-browse/locations-browse.component";
import { LoggingComponent } from "./logging/logging.component";
import { LoginComponent } from "./users/login";
import { MoveContainerComponent } from "./containers/move-container.component";
import { RegisterComponent } from "./users/register";

let administrationRoute = {
    path: "administration",
    component: AdministrationComponent,
    title: "Administration",
    canActivate: [AuthenticationGuard, AdminGuard]
};

let authorizationRoute = {
    path: "Authorization/:userId/:authorizationGuid",
    component: AuthorizationComponent,
    title: "Authorization User",
    canActivate: []
};

let conceptAddRoute = {
    path: "conceptAdd",
    component: ConceptAddComponent,
    title: "Add concept",
    canActivate: [AuthenticationGuard]
};

let conceptEditRoute = {
    path: "conceptedit/:id",
    component: ConceptEditComponent,
    title: "Edit concept",
    canActivate: [AuthenticationGuard]
};

let conceptProduceRoute = {
    path: "produce/:conceptid",
    component: ConceptProduceComponent,
    title: "Produce",
    canActivate: [AuthenticationGuard]
};

let conceptsListRoute = {
    path: "concepts",
    component: ConceptListComponent,
    title: "Concepts",
    canActivate: [AuthenticationGuard]
};

let conceptSplitRoute = {
    path: "container/split/:containerId",
    component: ConceptSplitComponent,
    title: "Container Split Compound",
    canActivate: [AuthenticationGuard]
};

let containerAddRoute = {
    path: "addcontainer",
    component: ContainerAddComponent,
    title: "AddContainer",
    canActivate: [AuthenticationGuard]
};

let containerAddRangeRoute = {
    path: "addrangecontainer",
    component: ContainerAddRangeComponent,
    title: "AddRangeContainer",
    canActivate: [AuthenticationGuard]
};

let containersListRoute = {
    path: "containers",
    component: ContainersListComponent,
    title: "Containers",
    canActivate: [AuthenticationGuard]
};

let containersListReloadRoute = {
    path: "containers/:reload",
    component: ContainersListComponent,
    title: "Containers",
    canActivate: [AuthenticationGuard]
};

let customProperties = {
    path: "customProperties",
    component: CustomPropertiesComponent,
    title: "Custom properties",
    canActivate: [AuthenticationGuard]
};

let homeRoute = {
    path: "",
    component: HomeComponent,
    title: "Life Science Lab",
    canActivate: []
};

let locationFreezerManagerAddRoute = {
    path: "locationfreezeradd/:type/:id",
    component: LocationFreezerManagerAddComponent,
    title: "AddLocationFreezer",
    canActivate: [AuthenticationGuard]
};

let locationFreezerManagerEditRoute = {
    path: "locationfreezeredit/:type/:id",
    component: LocationFreezerManagerEditComponent,
    title: "EditLocationFreezer",
    canActivate: [AuthenticationGuard]
};

let locationsBrowseRoute = {
    path: "locations",
    component: LocationsBrowseComponent,
    title: "Locations",
    canActivate: [AuthenticationGuard]
};

let loggingRoute = {
    path: "logs",
    component: LoggingComponent,
    title: "Log list",
    canActivate: [AuthenticationGuard]
};

let loginRoute = {
    path: "login",
    component: LoginComponent,
    title: "Login",
    canActivate: []
};

let loginRouteWithRedirect = {
    path: "login/:redirectUrl",
    component: LoginComponent,
    title: "Login",
    canActivate: []
};

let moveContainerRoute = {
    path: "movecontainer/:containerid",
    component: MoveContainerComponent,
    title: "MoveContainer",
    canActivate: [AuthenticationGuard]
};

let registerRoute = {
    path: "register",
    component: RegisterComponent,
    title: "Register User",
    canActivate: []
};

let unknownRoute = {
    path: "**",
    component: HomeComponent,
    title: "Life Science Lab",
    canActivate: []
};

const appRoutes: Routes = [
    administrationRoute,
    authorizationRoute,
    conceptAddRoute,
    conceptEditRoute,
    conceptProduceRoute,
    conceptsListRoute,
    conceptSplitRoute,
    containerAddRoute,
    containerAddRangeRoute,
    containersListRoute,
    containersListReloadRoute,
    customProperties,
    homeRoute,
    locationFreezerManagerAddRoute,
    locationFreezerManagerEditRoute,
    locationsBrowseRoute,
    loggingRoute,
    loginRoute,
    loginRouteWithRedirect,
    moveContainerRoute,
    registerRoute,
    unknownRoute
];

export const appRoutingProviders: any[] = [
    AuthenticationGuard, AdminGuard

];

export const routing = RouterModule.forRoot(appRoutes);
