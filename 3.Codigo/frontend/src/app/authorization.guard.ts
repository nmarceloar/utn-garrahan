import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService, MessageType } from './message.service';
import { NavigationService } from './navigation.service';
import { SessionService } from "./session.service";



@Injectable()
export class AuthorizationGuard implements CanActivate {

    private currentUser;

    constructor(
        private router: Router,
        private navigationService: NavigationService,
        private messageService: MessageService,
        private sessionService: SessionService) {

        this.sessionService.events.subscribe(d => {
            this.currentUser = d.user
        })

    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean> | Promise<boolean> | boolean {

        let requiredRoles = next.data.requiredRoles;
        let userRoles = this.currentUser.roles.map(d => d.name);

        let canActivate = requiredRoles.every(r => userRoles.includes(r));

        return of(canActivate).pipe(tap((canActivate) => {

            if (!canActivate) {

                this.messageService.sendMessage({
                    type: MessageType.DANGER,
                    persist: true,
                    text: `No se puede acceder a la página ${next.url}. No tiene los permisos necesarios.`
                })

                if (!this.router.navigated)
                    this.navigationService.navigateToHome();

            }

        }))

    }

}
