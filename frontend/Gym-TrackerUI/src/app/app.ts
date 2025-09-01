import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { Observable, Subscription, filter } from 'rxjs';
import { Auth } from './service/auth';
import { NgIf, AsyncPipe } from '@angular/common';







@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, AsyncPipe,],
 
  
  
  
  templateUrl: './app.html'
})

export class App implements OnInit, OnDestroy {
  hideButtons: boolean = false;
  isLoggedIn$!: Observable<boolean>;
  private routeSub?: Subscription;

  constructor(public service: Auth, private router: Router) {
    this.isLoggedIn$ = this.service.isLoggedIn();
  }

  ngOnInit(): void {
   

    this.routeSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.hideButtons = event.urlAfterRedirects.includes('/dashboard');
      });
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
