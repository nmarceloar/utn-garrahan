import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";



@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

    public breadcrumbs = [];

    private navigationEndStream;

    constructor(private router: Router) { }

    ngOnInit() {

        this.navigationEndStream =
            this.router.events.pipe(filter(event => event instanceof NavigationEnd))

        this.navigationEndStream
            .pipe(map(() => this.build()))
            .subscribe(breadcrumbs => {
                this.breadcrumbs = breadcrumbs;
            });

    }

    private build() {

        var breadcrumbs = [];
        for (var r = this.router.routerState.snapshot.root.firstChild; r; r = r.firstChild) {

            let segments = r.pathFromRoot
                .filter(d => d.url.length)
                .map(d => d.url.map(segment => segment.path).join("/"))

            breadcrumbs.push({
                title: r.data.breadcrumb,
                url: segments.join("/")
            });

        }

        return breadcrumbs;


    }

}
