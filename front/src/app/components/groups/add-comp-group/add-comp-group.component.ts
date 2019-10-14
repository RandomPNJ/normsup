import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, catchError, map } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { Observable, Subject, of, concat } from 'rxjs';
import { NotifService } from 'src/app/services/notif.service';
import { EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-add-comp-group',
  templateUrl: './add-comp-group.component.html',
  styleUrls: ['./add-comp-group.component.scss']
})
export class AddCompGroupComponent implements OnInit {

  @Output() hideModal = new EventEmitter<string>();

  errorMsg: String = '';
  filteredGroups = [];
  isLoading: Boolean = false;
  state: String = 'GROUPNAME';
  // state: String = 'GROUPMEMBERS';
  groupName: String;
  people$: Observable<any[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  selectedPersons: any[] = <any>[];
  constructor(private http: HttpService, private notif: NotifService) { }

  ngOnInit() {
    this.loadSupplier();
  }


  private loadSupplier() {
    this.people$ = concat(
      of([]), // default items
      this.peopleInput$.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.peopleLoading = true),
        switchMap(term => this.http.get('/api/supplier?search='+term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.peopleLoading = false)
        )),
        map(res => res['body'].items)
      )
    );
  }

  private nextStep(val) {
    this.state = val;
  }

  private createGroup() {
    let supps = [];
    this.selectedPersons.map(res => {
      supps.push({member_id: res.id});
    });
    console.log('supps == ', supps);
    this.http.post('/api/supplier/define_group', {name: this.groupName, suppliers: supps})
      .subscribe(res => {
        console.log('Success ', res);
        this.notif.success('Le groupe a été créé.');
        this.hideModal.emit('hide');
      },
      err => {
        this.notif.error(err);
        this.hideModal.emit('hide');
      })
    ;
  }
}
