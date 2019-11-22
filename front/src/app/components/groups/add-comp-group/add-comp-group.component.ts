import { Component, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, catchError, map } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { Observable, Subject, of, concat, fromEvent, from } from 'rxjs';
import { NotifService } from 'src/app/services/notif.service';
import { EventEmitter } from '@angular/core';
import {cloneDeep} from 'lodash';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-add-comp-group',
  templateUrl: './add-comp-group.component.html',
  styleUrls: ['./add-comp-group.component.scss']
})
export class AddCompGroupComponent implements OnInit, AfterViewInit {

  @Output() changeModal = new EventEmitter<string>();
  @ViewChild('searchSupplier') searchSupplierInput: ElementRef;
  @ViewChild('selectComponent') selectComponentRef;

  public input$ = new Subject<string>();
  suppliers$: Observable<any[]>;
  suppliersLoading = false;
  errorMsg: String = '';
  filteredGroups = [];
  isLoading: Boolean = false;
  showAlreadyExistsErr: Boolean = false;
  state: String = 'groupName';
  group: any = {
    name: ''
  };
  searchSupplier: String = '';
  groupName: String;
  suppliers: any[] = <any>[];
  selectedPersons: any[] = <any>[];
  documentsSettings: any = {
    legal: {
      urssaf: true,
      lnte: true,
      kbis: true,
    },
    comp: {
      
    }
  };

  constructor(private http: HttpService, private notif: NotifService) { }

  ngOnInit() {
    this.http.get('/api/supplier?search=')
      .subscribe(res => {
        console.log('loadSupplier res', res);
        if(res && res.body && res.body['items']) {
          this.suppliers = res.body['items'];
        }
      }, err => {
        console.log('loadSupplier err', err);
      })
    ;
  }

  ngAfterViewInit(): void {
  }


  public searchSupplierChange(val) {
    console.log('launched searchSupplierChange');
    this.input$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => this.suppliersLoading = true),
      switchMap(term => this.http.get('/api/supplier?search='+term).pipe(
        catchError(() => of([])), // empty list on error
        tap(() => this.suppliersLoading = false)
      )),
      map(res => res['body'].items)
    );
  }

  private loadSupplier(searchSupplier) {

    let uri;
    if(searchSupplier && searchSupplier !== '') {
      uri = '/api/supplier?search='+searchSupplier;
    } else {
      uri = '/api/supplier';
    }

    return this.http.get(uri)
      .subscribe(res => {
        if(res && res.body && res.body['items']) {
          this.suppliers = res.body['items'];
        }
      }, err => {
      })
    ;
  }

  private nextStep(val) {
    this.changeModal.emit(val);
    this.state = val;
  }

  showInfo() {
    console.log('parent selectedSuppliers', this.selectComponentRef.selectedSuppliers);
  }

  private checkGroupName(name) {
    let params = new HttpParams();
    params = params.set('name', name);
    this.http.get('/api/supplier/group/check_availability', params)
      .subscribe(res => {
        if(res.body['items'].exists) {
          this.showAlreadyExistsErr = true;
        } else {
          this.showAlreadyExistsErr = false;
          this.nextStep('groupMembers')
        }
        console.log('checkGroupName ', res);
      },
      err => {
        this.notif.error(err);
        this.changeModal.emit('hide');
      })
    ;
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
        this.changeModal.emit('hide');
      },
      err => {
        this.notif.error(err);
        this.changeModal.emit('hide');
      })
    ;
  }
}
