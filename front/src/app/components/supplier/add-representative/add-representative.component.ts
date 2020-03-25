import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { cloneDeep } from 'lodash';
import { HttpService } from 'src/app/services/http.service';
import { NotifService } from 'src/app/services/notif.service';
@Component({
  selector: 'app-add-representative',
  templateUrl: './add-representative.component.html',
  styleUrls: ['./add-representative.component.scss']
})
export class AddRepresentativeComponent implements OnInit {

  @Output() hideModal = new EventEmitter<string>();
  @Output() addInterlocModal = new EventEmitter<string>();
  @Input('supplierInfo') supplierInfo: any;
  
  modalState: String = 'interlocInfo';
  interlocObj: any = {

  };
  interlocFocus: any = {
    one: false,
    two: false,
    three: false,
    four: false,
  };

  interlocEmail;

  constructor(private httpService: HttpService, private notif: NotifService) { }

  ngOnInit() {
  }

  previous(state) {
    if(state === 'interlocInfo') {
      this.modalState = state;
    }
  }

  addInterloc() {
    let body = {
      repres: cloneDeep(this.interlocObj)
    };
    if(this.supplierInfo && this.supplierInfo.id) {
      body['supplierID'] = this.supplierInfo.id;
      this.httpService.post('/api/supplier/define_representative', body)
        .subscribe(res => {
          console.log('[AddRepresentativeComponent] res', res);
          this.modalState = 'interlocSuccess';
        }, err => {
          console.error('[AddRepresentativeComponent] Error :', err);
          this.notif.error('Une erreur s\'est produite, veuillez réessayer.');
          this.hideModal.emit();  
        })
      ;
    } else {
      this.notif.error('Une erreur s\'est produite, veuillez réessayer.');
      this.hideModal.emit();
    }
    this.modalState = 'interlocSuccess';
  }

  hideModalEvent() {
    this.interlocObj.supplierID = this.supplierInfo.id;
    this.addInterlocModal.emit(this.interlocObj);
  }
}
