import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'leftzeroes'
})
export class LeftzeroesPipe implements PipeTransform {

    transform(value: any, args?: any): any {

        return value.toString().padStart(6, 0);

    }

}
