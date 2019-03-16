import { Component, OnInit } from '@angular/core';
import { InstitutionsService, Institution, InstitutionType } from '../institutions.service';
import { zip } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit {

    searchForm: FormGroup = new FormGroup({
        name: new FormControl(""),
        cuit: new FormControl(""),
        email: new FormControl("")
    })

    _institutions: Institution[] = []
    institutions: Institution[] = []
    institutionTypes: InstitutionType[] = []

    constructor(private institutionService: InstitutionsService, private router: Router) { }

    ngOnInit() {

        zip(this.institutionService.find({ include: { type: true }, order: ["creation_date DESC"] }), this.institutionService.findTypes())
            .subscribe(
                (d) => {
                    [this.institutions, this.institutionTypes] = d
                    this._institutions = this.institutions
                },
                (err) => window.alert(err.message)
            )

        this.searchForm.valueChanges
            .subscribe(searchQuery => {

                this.institutions =
                    this._institutions.filter(i => i.name.toLowerCase().includes(searchQuery.name.toLowerCase()))

            })



    }

    createInstitution() {


        this.router.navigateByUrl("/administradores/instituciones/alta");


    }

}
