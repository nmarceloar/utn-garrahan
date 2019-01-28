import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderIrradiationComponent } from './order-irradiation/order-irradiation.component';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class IrradiationInProcessGuard implements CanDeactivate<OrderIrradiationComponent> {

    constructor(private messageService: MessageService) { }

    canDeactivate(component: OrderIrradiationComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {


        if (!component.canDeactivate()) {

            this.messageService.error("No se puede navegar, hay una irradiación en proceso.")

            return false

        } else {

            return true

        }


    }

}
