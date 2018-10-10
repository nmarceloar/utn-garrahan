import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    users

    constructor(
        private messageService: MessageService,
        private userService: UserService) { }

    ngOnInit() {

        this.userService.find({ order: ["orderCount DESC"] })
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


}
