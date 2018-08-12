import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { SessionService } from "./session.service";


@Injectable()
export class NavigationService {

    private currentUser;

    constructor(
        private router: Router,
        private sessionService: SessionService) {

        this.sessionService.events.subscribe(d => {
            this.currentUser = d.user;
        })


    }

    public navigateToHome() {

        (this.currentUser.isInternal) ?
            this.router.navigateByUrl("operadores") :
            this.router.navigateByUrl("clientes")

    }


}
