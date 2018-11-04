
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdministratorComponent } from "./administrator/administrator.component";
import { MessageStackComponent } from './alert/alert.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationGuard } from "./authentication.guard";
import { AuthorizationGuard } from "./authorization.guard";
import { AutofocusDirective } from './autofocus.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { ErrorInterceptor } from "./error-interceptor";
import { ExpiringAlertComponent } from './expiring-alert/expiring-alert.component';
import { InstitutionsService } from "./institutions.service";
import { LoginComponent } from './login/login.component';
import { MessageService } from "./message.service";
import { ModalLoginComponent } from './modal-login/modal-login.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { NavComponent } from './nav/nav.component';
import { NavigationService } from "./navigation.service";
import { NotFoundComponent } from './not-found/not-found.component';
import { OperatorComponent } from "./operator/operator.component";
import { OrderConciliationComponent } from './order-conciliation/order-conciliation.component';
import { OrderIrradiationComponent } from './order-irradiation/order-irradiation.component';
import { OrderService } from './order.service';
import { PaginationComponent } from './pagination/pagination.component';
import { PendingChangesGuard } from "./pending-changes.guard";
import { SessionService } from "./session.service";
import { TokenInterceptor } from "./token-interceptor";
import { UserService } from './user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ClientComponent } from './client/client.component';
import { PreventDefaultDirective } from './prevent-default.directive';
import { MessageComponent } from './message/message.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { AlreadyInGuard } from './already-in.guard';
import { CancelConfirmationModalComponent } from './cancel-confirmation-modal/cancel-confirmation-modal.component';
import { UnitEditModalComponent } from './unit-edit-modal/unit-edit-modal.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { LeftzeroesPipe } from './leftzeroes.pipe';
import { UsersComponent } from './users/users.component';

import { CreateInstitutionComponent } from "./create-institution/create-institution.component";
import { InstitutionDetailsComponent } from './institution-details/institution-details.component';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { CuitPipe } from './cuit.pipe';
import { ModalReloginComponent } from './modal-relogin/modal-relogin.component';
import { ConfirmActionModalComponent } from './confirm-action-modal/confirm-action-modal.component';
import { HemocomponentsComponent } from './hemocomponents/hemocomponents.component';
import { EditHemocomponentModalComponent } from './edit-hemocomponent-modal/edit-hemocomponent-modal.component';
import { ConfigManagementComponent } from './config-management/config-management.component'
import { ConfigService } from './config.service';
import { SelectUnitModalComponent } from './select-unit-modal/select-unit-modal.component';


const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
        LoginComponent,
        OrderConciliationComponent,
        AdministratorComponent,
        ClientComponent,
        MessageStackComponent,
        AutofocusDirective,
        BreadcrumbComponent,
        OperatorComponent,
        NavComponent,
        ConfirmModalComponent,
        ExpiringAlertComponent,
        ModalLoginComponent,
        PaginationComponent,
        OrderIrradiationComponent,
        DailyReportComponent,
        MonthlyReportComponent,
        CreateOrderComponent,
        EditOrderComponent,
        CreateUserComponent,
        PreventDefaultDirective,
        MessageComponent,
        ProgressBarComponent,
        CancelConfirmationModalComponent,
        UnitEditModalComponent,
        InstitutionsComponent,
        LeftzeroesPipe,
        UsersComponent,
        CreateInstitutionComponent,
        InstitutionDetailsComponent,
        AccountActivationComponent,
        PasswordResetComponent,
        PasswordChangeComponent,
        CuitPipe,
        ModalReloginComponent,
        ConfirmActionModalComponent,
        HemocomponentsComponent,
        EditHemocomponentModalComponent,
        ConfigManagementComponent,
        SelectUnitModalComponent
    ],
    imports: [
        NgbModule.forRoot(),
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        OrderService,
        UserService,
        SessionService,
        MessageService,
        ConfigService,
        PendingChangesGuard,
        AuthenticationGuard,
        AuthorizationGuard,
        InstitutionsService,
        NavigationService,
        AlreadyInGuard,
        httpInterceptorProviders
    ],
    entryComponents: [
        SelectUnitModalComponent,
        ConfirmModalComponent,
        ModalLoginComponent,
        EditHemocomponentModalComponent,
        CancelConfirmationModalComponent,
        UnitEditModalComponent,
        ModalReloginComponent,
        ConfirmActionModalComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }

