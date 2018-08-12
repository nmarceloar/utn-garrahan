import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Message } from '../message.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnChanges, OnDestroy {

    static DEFAULT_TTL: number = 8;
    static STEP: number = 100;

    @Input()
    message: Message

    @Output()
    close: EventEmitter<any> = new EventEmitter();

    s: Subscription;

    percent: number = 100;

    constructor() { }

    ngOnInit() {

        let ttl = this.message.ttlInSeconds * 1000 || MessageComponent.DEFAULT_TTL * 1000;

        this.s =
            interval(MessageComponent.STEP)
                .pipe(take(Math.floor(ttl / MessageComponent.STEP)))
                .subscribe(
                    () => this.percent -= Math.floor(MessageComponent.STEP / ttl * MessageComponent.STEP),
                    (err) => console.error(err),
                    () => this.close.emit()
                )

    }

    ngOnDestroy(): void {

        this.s.unsubscribe();

    }

    ngOnChanges(changes: SimpleChanges): void {}

    onClose() {

        this.close.emit()

    }


}
