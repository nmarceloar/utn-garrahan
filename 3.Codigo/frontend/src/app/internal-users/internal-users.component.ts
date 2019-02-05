import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-internal-users',
    templateUrl: './internal-users.component.html',
    styleUrls: ['./internal-users.component.css']
})
export class InternalUsersComponent implements OnInit {

    users

    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService) { }

    ngOnInit() {

        this.userService.operators()
            .subscribe((users) => { this.users = users }, err => this.handleError(err));

    }

    disableUser(userId) {

        this.userService.disable(userId)
            .subscribe(() => this.ngOnInit(), err => this.handleError(err))

    }

    enableUser(userId) {

        this.userService.enable(userId)
            .subscribe(() => this.ngOnInit(), err => this.handleError(err))

    }

    handleError(err) {

        this.messageService.error(err.message)

    }

    newUser() {

        this.router.navigateByUrl("/administradores/usuarios/alta")

    }

    edit(userId) {

        this.router.navigateByUrl(`/administradores/usuarios/${userId}`)

    }

    promote(userId) {

        this.userService.makeAdmin(userId, { isAdmin: true })
            .subscribe(() => this.ngOnInit(), err => this.handleError(err))


    }

    demote(userId) {

        this.userService.makeAdmin(userId, { isAdmin: false })
            .subscribe(() => this.ngOnInit(), err => this.handleError(err))


    }



}
