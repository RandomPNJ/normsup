import { Component, OnInit, Output, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, catchError, map } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { Observable, Subject, of, concat, fromEvent, from } from 'rxjs';
import { NotifService } from 'src/app/services/notif.service';
import { EventEmitter } from '@angular/core';
import {cloneDeep, differenceBy} from 'lodash';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SelectListComponent } from '../select-list/select-list.component';

@Component({
  selector: 'app-add-comp-group',
  templateUrl: './add-comp-group.component.html',
  styleUrls: ['./add-comp-group.component.scss']
})
export class AddCompGroupComponent implements OnInit {

  @Input() groupName;
  @Input() type;
  @Input() id;
  @Output() changeModal = new EventEmitter<string>();
  @ViewChild('selectComponent') selectComponentRef: SelectListComponent;

  public input$ = new Subject<string>();
  suppliers$: Observable<any[]>;
  onInitSuppliers: any;
  suppliersLoading = false;
  errorMsg: String = '';
  filteredGroups = [];
  isLoading: Boolean = false;
  showAlreadyExistsErr: Boolean = false;
  state: String = 'groupName';
  selectedSuppliers: any = [];
  group: any = {
    name: ''
  };
  searchSupplier: String = '';
  suppliers: any[] = <any>[];

  documentsSettings: any = {
    legal: {
      urssaf: true,
      lnte: true,
      kbis: true,
    },
    comp: {

    }
  };

  constructor(private http: HttpService, 
    private notif: NotifService,
    private router: Router) { }

  ngOnInit() {
    this.group.name = this.groupName;
    if(this.type === 'MODIFICATION' && this.id) {
      this.http.get('/api/supplier/group/'+ this.id + '/members')
        .subscribe(res => {
          if(res.body && res.body['items']) {
            this.onInitSuppliers = res.body['items'];
            console.log('this.onInitSuppliers', this.onInitSuppliers )
          }
        }, err => {
          console.log('loadSupplier err', err);
        })
      ;
    }
    this.http.get('/api/supplier?search=')
      .subscribe(res => {
        if(res && res.body && res.body['items']) {
          this.suppliers = res.body['items'];
        }
      }, err => {
        console.log('loadSupplier err', err);
      })
    ;
  }

  public searchSupplierChange(val) {
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
    if(val === 'groupMembers' && this.type === 'MODIFICATION') {

    }
    if(val === 'docInfo' && this.type === 'MODIFICATION') {
      this.selectedSuppliers = Object.values(this.selectComponentRef.selectedSuppliers);
      return this.createGroup();
    }
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
    if(this.type === 'MODIFICATION') {
      return this.nextStep('groupMembers'); 
    } else {
      let params = new HttpParams();
      params = params.set('name', name);
      this.http.get('/api/supplier/group/check_availability', params)
        .subscribe(res => {
          if(res.body['items'].exists) {
            this.showAlreadyExistsErr = true;
          } else {
            this.showAlreadyExistsErr = false;
            this.nextStep('groupMembers');
          }
        },
        err => {
          this.notif.error(err);
          this.changeModal.emit('hide');
        })
      ;
    }
  }

  //TODO: Rework this function, I made this on a hurry so it's very poorly written
  private createGroup() {
    const docSettings = {
      comp_docs: '',
      frequency: '5d'
    };
    let i = 0;
    let data;
    let uri;
    let sSuppliers = [];
    let supplier;
    this.selectedSuppliers.map(supp => {
      if(supp.checked === true) {
        supplier = cloneDeep(supp);
        delete supplier['checked'];
        delete supplier['show'];
        sSuppliers.push(supplier);
      }
    });

    let suppToDelete = differenceBy(this.onInitSuppliers, sSuppliers, 'id');
    let suppToAdd = differenceBy(sSuppliers, this.onInitSuppliers, 'id');

    //TODO: Use this
    Object.keys(this.documentsSettings.legal).map((key, ind) => {
      if(this.documentsSettings.legal[key]) {
        if(i !== 0) {
          docSettings['legal_docs'] += '_' + key.charAt(0).toLowerCase();
        } else {
          docSettings['legal_docs'] = key.charAt(0).toLowerCase();
        }
        i++;
      }
    });
    
    if(this.type === 'MODIFICATION' && this.id) {
      uri = '/api/supplier/group/' + this.id +'/modify_group';
      data = {name: this.group.name, suppliers: suppToAdd, deleteSuppliers: suppToDelete, remindersSettings: docSettings};
    } else {
      uri = '/api/supplier/define_group';
      data = {name: this.group.name, suppliers: suppToAdd, remindersSettings: docSettings};
    }

    this.http.post(uri, data)
      .subscribe(() => {
        if(this.type !== 'MODIFICATION') {
          this.changeModal.emit('newGroup');
          this.state = 'newGroup';
        } else {
          this.changeModal.emit('MODIFICATION');
          this.notif.success('Groupe modifié avec succès.');
        }
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
