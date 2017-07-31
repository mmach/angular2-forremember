import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ViewContainerRef } from '@angular/core';
import { routing,  appRoutingProviders } from './app.routing';

// components
import { AdministrationComponent } from './administration/administration.component';
import { AuthorizationComponent } from './users/authorization';
import { BootstrapSwitchComponent } from './customComponents/bootstrapSwitch/bootstrapSwitch.component';
import { ConceptAddComponent } from './concepts/concept-add/concept-add.component';
import { ConceptEditComponent } from './concepts/concept-edit/concept-edit.component';
import { ConceptProduceComponent } from './concepts/concept-produce/concept-produce.component';
import { ConceptListComponent } from './concepts/concept-list/concept-list.component';
import { ConceptSplitComponent } from './concepts/concept-split/concept-split.component';
import { ContainerAddComponent } from './containers/container-add.component';
import { ContainerAddRangeComponent } from './containers/container-addrange.component';
import { ContainersListComponent } from './containers/containers-list.component';
import { CustomPropertiesComponent } from './CustomProperties/customProperties.component';
import { HomeComponent } from './home';
import { LayoutMapView } from './customComponents/layoutMap/layout-map-view/layout-map-view.component';
import { LayoutMapItemView } from './customComponents/layoutMap/layout-mapitem-view/layout-mapitem-view.component';
import { LocationFreezerManagerAddComponent } from './locationFreezerManager/locationFreezerManager-add.component';
import { LocationFreezerManagerEditComponent } from './locationFreezerManager/locationFreezerManager-edit.component';
import { LocationsBrowseComponent } from './locations/locations-browse/locations-browse.component';
import { LoggingComponent } from './logging/logging.component';
import { LoginComponent } from './users/login';
import { ModalWindowComponent } from './customComponents/modalWindow/modal-window.component';
import { MoveContainerComponent } from './containers/move-container.component';
import { RegisterComponent } from './users/register';
import { PaginationComponent } from './customComponents/paginationComponent/pagination.component';
import { Preloader } from './customComponents/preloader/preloader.component';
import { BaseModal } from './customComponents/modal/baseModal/base-modal.component';
import { ContainerDetailsComponent } from './containers/Container-details.Component';
import { Autocomplete } from './autocomplete/autocomplete.component';
import { ContainerTakeOutComponent } from './containers/container-takeout.Component';
import { ContainerPutInComponent } from './containers/container-putin.component';

import { ValidationModel } from './customComponents/validation/validation-model.directive';
import { NumberInputComponent } from './customComponents/numberInput/numberInput.component';


import { TreeView } from './locations/tree-view/tree-view.component';
import { NodePropertiesView } from './locations/node-properties-view/node-properties-view.component';
import { CountryBranchView } from './locations/country-branch-view/country-branch-view.component';
import { CityBranchView } from './locations/city-branch-view/city-branch-view.component';
import { OfficeBranchView } from './locations/office-branch-view/office-branch-view.component';
import { LocationsService } from './services/locations.service';
import { LogginService } from './services/logging.service';
import { ContainersMagazineOrRackSource } from './services/ContainersMagazineOrRackSource';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { MessageBarComponent } from './message-bar/message-bar.component';
import { ConsumeComponent } from './customComponents/modal/consume-component/consume.component';
import { OverlayWrapperComponent } from './customComponents/overlayWrapper/overlayWrapper.component';
import { SequenceEditor } from './customComponents/sequenceEditor/sequenceEditor.component';

// services
import { Broadcaster } from './helper/broadcast';
import { GlobalVars } from './global-vars';
import { BaseService } from './services/base.service';
import { FreezersService } from './services/freezers.service';
import { ContainersService } from './services/containers.service';
import { ContainerTypesService } from './services/containerTypes.service';
import { ConceptsService } from './services/concepts.service';
import { ConceptTypesService } from './services/conceptTypes.service';
import { CqrsService } from './services/cqrs.service';
import { CustomPropertiesService } from './services/customproperties.service';
import { ModalWindowService } from './services/modalWindow.service';
import { UsersService } from './services/users.service';
import { UserRolesService } from './services/userRoles.service';

@NgModule({
    declarations: [
        AppComponent,
        Autocomplete,
        AdministrationComponent,
        AuthorizationComponent,
        BootstrapSwitchComponent,
        ConceptAddComponent,
        ConceptEditComponent,
        ConceptProduceComponent,
        ConceptListComponent,
        ConceptSplitComponent,
        ContainerAddComponent,
        ConceptEditComponent,
        ConceptProduceComponent,
        ConceptSplitComponent,
        ContainerAddComponent,
        ContainerAddRangeComponent,
        ContainersListComponent,
        CustomPropertiesComponent,
        OverlayWrapperComponent,
        HomeComponent,
        LayoutMapView,
        LayoutMapItemView,
        LocationFreezerManagerAddComponent,
        LocationFreezerManagerEditComponent,
        LocationsBrowseComponent,
        LoggingComponent,
        LoginComponent,
        ModalWindowComponent,
        MoveContainerComponent,
        RegisterComponent,
        ValidationModel,
        PaginationComponent,
        Preloader,
        BaseModal,
        ContainerDetailsComponent,
        TreeView,
        NodePropertiesView,
        CountryBranchView,
        CityBranchView,
        OfficeBranchView,
        ConsumeComponent,
        SequenceEditor,
        LayoutMapItemView,
        Preloader,
        SequenceEditor,
        ContainerTakeOutComponent,
        NavigationBarComponent,
        MessageBarComponent,
        BootstrapSwitchComponent,
        ContainerPutInComponent,
        NumberInputComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpModule,
        FormsModule,
        routing
    ],
    providers: [
        appRoutingProviders,
        Broadcaster,
        ContainersService,
        ContainerTypesService,
        ContainersMagazineOrRackSource, // it is needed for autocomplete component
        ConceptsService,
        ConceptTypesService,
        GlobalVars,
        UsersService,
        FreezersService,
        CustomPropertiesService,
        CqrsService,
        ViewContainerRef,
        LocationsService,
        ModalWindowService,
        Broadcaster,
        GlobalVars,
        LogginService,
        UserRolesService,
        BaseService
    ],
    entryComponents: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
