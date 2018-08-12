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
        component: ClientComponent,
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
                path: "usuarios/alta",
                component: CreateUserComponent,
                data: {
                    breadcrumb: "Alta de usuarios"
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
