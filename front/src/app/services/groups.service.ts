import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private groups: Subject<any> = new BehaviorSubject<any>([]);

  
  constructor() { }
  
  
  get groups$(){
    return this.groups.asObservable().pipe(filter(groups => !!groups));
  }

  addGroups(data: any) {
    this.groups.next(data);
  }

}
