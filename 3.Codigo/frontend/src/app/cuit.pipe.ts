import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cuit'
})
export class CuitPipe implements PipeTransform {

    transform(value: any, args?: any): any {

        return `${value.substr(0, 2)}-${value.substr(2, 8)}-${value.substr(10, 10)}`;

    }

}
