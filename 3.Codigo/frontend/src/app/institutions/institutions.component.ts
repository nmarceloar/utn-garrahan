import { Component, OnInit } from '@angular/core';
import { InstitutionsService, Institution, InstitutionType } from '../institutions.service';
import { zip } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit {

    institutions: Institution[] = []
    institutionTypes: InstitutionType[] = []

    constructor(private institutionService: InstitutionsService, private router: Router) { }

    ngOnInit() {

        zip(this.institutionService.find({ include: { type: true }, order: ["creation_date DESC"] }), this.institutionService.findTypes())
            .subscribe(
                (d) => [this.institutions, this.institutionTypes] = d,
                (err) => window.alert(err.message)
            )


    }

    createInstitution() {


        this.router.navigateByUrl("/administradores/instituciones/alta");


    }

}
