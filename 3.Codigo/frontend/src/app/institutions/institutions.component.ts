import { Component, OnInit } from '@angular/core';
import { InstitutionsService, Institution, InstitutionType } from '../institutions.service';
import { zip } from 'rxjs';

@Component({
    selector: 'app-institutions',
    templateUrl: './institutions.component.html',
    styleUrls: ['./institutions.component.css']
})
export class InstitutionsComponent implements OnInit {

    institutions: Institution[] = []
    institutionTypes: InstitutionType[] = []

    constructor(private institutionService: InstitutionsService) { }

    ngOnInit() {

        zip(this.institutionService.find({ include: { type: true } }), this.institutionService.findTypes())
            .subscribe(
                (d) => [this.institutions, this.institutionTypes] = d,
                (err) => window.alert(err.message)
            )


    }

}
