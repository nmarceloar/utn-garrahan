import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MessageService, MessageType } from './message.service';
import { SessionService } from './session.service';
import { tap } from 'rxjs/operators';
import { NavigationService } from './navigation.service';

@Injectable()
export class AlreadyInGuard implements CanActivate {

    private isAuthenticated: boolean = false;

    constructor(
        private router: Router,
        private navigationService: NavigationService,
        private messageService: MessageService,
        private sessionService: SessionService) {

        this.sessionService.events.subscribe((d) => {
            this.isAuthenticated = !!d.user;
        })

    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean> | Promise<boolean> | boolean {

        return of(!this.isAuthenticated).pipe(tap((canActivate) => {

            if (!canActivate) {

                if (!this.router.navigated)
                    this.navigationService.navigateToHome();



            }


        }))


    }



}

