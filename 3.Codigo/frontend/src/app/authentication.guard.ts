import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MessageService, MessageType } from "./message.service";
import { SessionService } from "./session.service";
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthenticationGuard implements CanActivate {

    private isAuthenticated: boolean = false;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private sessionService: SessionService) {

        this.sessionService.events.subscribe((d) => {
            this.isAuthenticated = !!d.user;
        })

    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean> | Promise<boolean> | boolean {

        return of(this.isAuthenticated).pipe(tap((canActivate) => {

            if (!canActivate) {

                this.messageService.sendMessage({
                    type: MessageType.DANGER,
                    persist: true,
                    text: "No se puede acceder a la página. Inicie sesión."
                })

                this.router.navigateByUrl("login"); 

            }


        }))


    }


}
