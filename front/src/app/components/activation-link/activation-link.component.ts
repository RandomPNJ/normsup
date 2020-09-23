import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-activation-link',
  templateUrl: './activation-link.component.html',
  styleUrls: ['./activation-link.component.scss']
})
export class ActivationLinkComponent implements OnInit {

  activated: Boolean = true;
  accActivated: Boolean = false;
  expired: Boolean = false;
  alreadyActivated: Boolean = false;
  invalidToken: Boolean = false;

  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // FAIRE LA GESTION D'ERREUR
    this.route.params.subscribe(params => {
      if(params && params['activationToken']) {
        let activationToken = params['activationToken'];
        this.httpService.post('/api/auth/activate', {'activationToken': activationToken})
          .subscribe(res => {
            console.log('[ActivationLinkComponent] res', res);
            this.accActivated = true;
          }, err => {
            console.log('[ActivationLinkComponent] err', err);
            if(err.code === 1) this.alreadyActivated = true;
            if(err.code === 2) this.expired = true;
            if(err.code === 3) this.router.navigate(['login']);
          })
        ;
      } else {
        this.router.navigate(['login']);
      }
    });
  }

}
