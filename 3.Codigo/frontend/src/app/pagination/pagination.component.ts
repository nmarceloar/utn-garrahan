import { Component, OnInit, OnChanges, OnDestroy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    page: number;

    @Input()
    pageSize: number;

    @Input()
    pageSizes: number[];

    @Input()
    itemCount: number;

    @Output()
    pageChange = new EventEmitter<number>();

    @Output()
    pageSizeChange = new EventEmitter<number>();

    pageSizeControl: FormControl = new FormControl();

    links: number[] = []

    constructor() { }

    ngOnInit() {

        this.pageSizeControl.setValue(this.pageSize)
        this.pageSizeControl.valueChanges
            .subscribe(pageSize => this.pageSizeChange.emit(pageSize))

    }

    ngOnDestroy(): void { }

    ngOnChanges(changes: SimpleChanges): void {

        this.links = this.range(1, Math.ceil(this.itemCount / this.pageSize));

    }

    private range(min, max) {

        let d = [];
        for (var i = min; i <= max; i++)
            d.push(i)

        return d;

    }

    previous() {

        this.pageChange.emit(this.page - 1)

    }

    next() {

        this.pageChange.emit(this.page + 1)

    }

    goToPage(selectedPage) {

        this.pageChange.emit(selectedPage);

    }

    first() {

        this.pageChange.emit(1)

    }

    last() {

        this.pageChange.emit(this.links.length)

    }

    get hasPrevious() {

        return this.page > 1; 

    }

    get hasNext() {

        return this.page < this.links.length

    }






}
