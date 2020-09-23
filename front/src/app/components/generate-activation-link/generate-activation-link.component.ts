import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-generate-activation-link',
  templateUrl: './generate-activation-link.component.html',
  styleUrls: ['./generate-activation-link.component.scss']
})
export class GenerateActivationLinkComponent implements OnInit {

  linkEmail: string = '';
  constructor(private httpService: HttpService) { }

  ngOnInit() {
  }


  generate() {
    if(this.linkEmail !== '') {
      return this.httpService.post('/api/auth/generate_activation_link', {email: this.linkEmail})
        .subscribe(res => {
          console.log('[GenerateActivationLinkComponent] res', res);
        }, err => {
          console.log('[GenerateActivationLinkComponent] err', err);
        })
      ;
    }
  }
}
