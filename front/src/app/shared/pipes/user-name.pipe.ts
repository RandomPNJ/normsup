import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'userNamePipe'})
export class UserNamePipe implements PipeTransform {
  transform(user: any, ...args: any[]): any {
    let firstName: string = user.name;
    let lastName: string = user.lastname;

    if (args.includes('uppercase')) {
      firstName = firstName.toUpperCase();
      lastName = lastName.toUpperCase();
    }

    if (args.includes('nameCut')) {
      const cut = firstName.charAt(0);
      firstName = cut + '.';
    }

    return firstName + ' ' + lastName;
  }
}
