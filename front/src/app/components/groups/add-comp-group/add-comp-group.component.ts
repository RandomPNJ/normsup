import { Component, OnInit, Output, ViewChild, ElementRef, AfterViewInit, ViewChildren, OnChanges } from '@angular/core';
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
export class AddCompGroupComponent implements OnInit, OnChanges, AfterViewInit {

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
  selectedSuppliers: any;
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

  ngOnChanges(): void {
    // this.selectComponentRef.changes
    //   .subscribe(changes => {
    //     console.log('changes', changes);
    //   })
    // ;
  }

  ngAfterViewInit(): void {
    console.log('this.selectComponentRef', this.selectComponentRef)
    // this.selectComponentRef.changes
    //   .subscribe(changes => {
    //     console.log('changes', changes);
    //   })
    // ;
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

  private previous(val) {
    if(val === 'groupName') {
      this.changeModal.emit(val);
      this.state = val;
    }
    if(val === 'groupMembers') {
      this.changeModal.emit(val);
      this.state = val;
    }
  }

  private nextStep(val) {
    if(val === 'docInfo') {
      this.selectedSuppliers = Object.values(this.selectComponentRef.selectedSuppliers);
    }
    if(val === 'groupName') {
      this.group.name = '';
      this.selectedSuppliers = [];
      this.suppliers = [];
    }
    this.changeModal.emit(val);
    this.state = val;
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
    this.selectedSuppliers.map(supp => {
      delete supp['checked'];
      delete supp['show'];
    })
    console.log('supps == ', this.selectedSuppliers);
    this.http.post('/api/supplier/define_group', {name: this.group.name, suppliers: this.selectedSuppliers})
      .subscribe(res => {
        console.log('Success ', res);
        this.changeModal.emit('newGroup');
        this.state = 'newGroup';
      },
      err => {
        this.notif.error(err);
        this.changeModal.emit('hide');
      })
    ;
  }

  private closeModal() {
    this.changeModal.emit('hide');
  }
}
