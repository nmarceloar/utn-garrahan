import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from "./authentication.guard";
import { AuthorizationGuard } from "./authorization.guard";
import { LoginComponent } from "./login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { OperatorComponent } from "./operator/operator.component";
import { OrderConciliationComponent } from './order-conciliation/order-conciliation.component';
import { OrderIrradiationComponent } from './order-irradiation/order-irradiation.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ClientComponent } from './client/client.component';
import { AlreadyInGuard } from './already-in.guard';
import { InstitutionsComponent } from './institutions/institutions.component';
import { UsersComponent } from './users/users.component';
import { CreateInstitutionComponent } from './create-institution/create-institution.component';
import { InstitutionDetailsComponent } from './institution-details/institution-details.component';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { HemocomponentsComponent } from './hemocomponents/hemocomponents.component';
import { ConfigManagementComponent } from './config-management/config-management.component';
import { PendingChangesGuard } from './pending-changes.guard';
import { IrradiationInProcessGuard } from './irradiation-in-process.guard';
import { StockSimulationComponent } from './stock-simulation/stock-simulation.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { InternalUsersComponent } from './internal-users/internal-users.component';


const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent,
        data: {
            breadcrumb: "Inicio de Sesión"
        },
        canActivate: [
            AlreadyInGuard
        ]
    },
    {
        path: "password-reset",
        component: PasswordResetComponent,
        data: {
            breadcrumb: "Blanqueo de contraseña"
        }
    },
    {
        path: "password-change",
        component: PasswordChangeComponent,
        data: {
            breadcrumb: "Cambiar contraseña"
        }
    },
    {
        path: "confirmar-cuenta",
        component: AccountActivationComponent,
        data: {
            breadcrumb: "Confirmar cuenta"
        }
    },
    {
        path: "operadores",
        data: {
            breadcrumb: "Operadores",
            requiredRoles: ["operator"]
        },
        canActivate: [
            AuthenticationGuard,
            AuthorizationGuard
        ],
        children: [
            {
                path: "",
                component: OperatorComponent,
                data: {
                    breadcrumb: "Home"
                }
            },
            {
                path: "ordenes/:id/revisión",
                component: OrderConciliationComponent,
                data: {
                    breadcrumb: "Revisión de órdenes"
                }
            },
            {
                path: "ordenes/:id/irradiación",
                component: OrderIrradiationComponent,
                canDeactivate: [IrradiationInProcessGuard],
                data: {
                    breadcrumb: "Irradiación de órdenes"
                }
            },
            {
                path: "informes/diario",
                component: DailyReportComponent,
                data: {
                    breadcrumb: "Informe diario de órdenes finalizadas"
                }
            },
            {
                path: "informes/mensual",
                component: MonthlyReportComponent,
                data: {
                    breadcrumb: "Informe mensual de unidades irradiadas"
                }
            }
        ]
    },
    {
        path: "clientes",
        data: {
            breadcrumb: "Clientes",
            requiredRoles: ["client"]
        },
        canActivate: [
            AuthenticationGuard,
            AuthorizationGuard
        ],
        children: [
            {
                path: "",
                component: ClientComponent,
                data: {
                    breadcrumb: "Home"
                }
            },
            {
                path: "ordenes/alta",
                component: CreateOrderComponent,
                data: {
                    breadcrumb: "Alta de órdenes"
                }
            },
            {
                path: "ordenes/:id",
                component: EditOrderComponent,
                data: {
                    breadcrumb: "Detalles de órdenes"
                }
            }
        ]
    },
    {
        path: "administradores",
        data: {
            breadcrumb: "Administradores",
            requiredRoles: ["admin"]
        },
        canActivate: [
            AuthenticationGuard,
            AuthorizationGuard
        ],
        children: [
            {
                path: "",
                component: AdministratorComponent,
                data: {
                    breadcrumb: "Home"
                }
            },
            {
                path: "simulación",
                component: StockSimulationComponent,
                data: {
                    breadcrumb: "Simulación de stock"
                }
            },
            {
                path: "configuración",
                component: ConfigManagementComponent,
                data: {
                    breadcrumb: "Configuración del sistema"
                }
            },
            {
                path: "hemocomponentes",
                component: HemocomponentsComponent,
                data: {
                    breadcrumb: "Hemocomponentes"
                }
            },

            {
                path: "instituciones",
                component: InstitutionsComponent,
                data: {
                    breadcrumb: "Listado de instituciones clientes"
                }
            },
            {
                path: "instituciones/alta",
                component: CreateInstitutionComponent,
                data: {
                    breadcrumb: "Alta de instituciones"
                }
            },
            {
                path: "instituciones/:id",
                component: InstitutionDetailsComponent,
                data: {
                    breadcrumb: "Información"
                }
            },
            {
                path: "listado-clientes",
                component: UsersComponent,
                data: {
                    breadcrumb: "Administracion de usuarios clientes"
                }
            },
            {
                path: "listado-operadores",
                component: InternalUsersComponent,
                data: {
                    breadcrumb: "Administracion de operadores"
                }
            },
            {
                path: "usuarios/alta",
                component: CreateUserComponent,
                data: {
                    breadcrumb: "Alta de usuarios"
                }
            },
            {
                path: "usuarios/:id",
                component: EditUserComponent,
                data: {
                    breadcrumb: "Edición de usuarios"
                }
            }


        ]

    },
    {
        path: "**",
        component: NotFoundComponent,
        data: {
            breadcrumb: "Error"
        }
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
