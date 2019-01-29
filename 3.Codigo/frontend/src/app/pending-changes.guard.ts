import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from "./can-component-deactivate";


@Injectable()
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {

    constructor() {}

    canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        return component.canDeactivate();

    }

}
