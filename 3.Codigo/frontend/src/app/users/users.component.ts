import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users
  constructor(private userService: UserService) { 
  }


  ngOnInit() {
      this.userService.findAll().subscribe((users)=>{this.users=users},err => console.error(err));
      
  }

}
