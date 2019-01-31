import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-hemocomponent-modal',
  templateUrl: './edit-hemocomponent-modal.component.html',
  styleUrls: ['./edit-hemocomponent-modal.component.css']
})
export class EditHemocomponentModalComponent implements OnInit {
  public title="Un titulo";
  public message="Un Mensaje";
  constructor() { }

  ngOnInit() {
  }
  dismiss(){}
  confirm(){}
}
