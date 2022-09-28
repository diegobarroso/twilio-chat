import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { StoreService } from '../../services/store.service';
import { Session } from '@supabase/supabase-js';
import { TwilioService } from '../../services/twilio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  user!: User;
  session!: Session | null;
  errorMessage!: string | null;

  constructor(private authService: AuthService,
              private router: Router,
              private store: StoreService,
              private twilioService: TwilioService) {}

  ngOnInit(): void {
    
    this.authService.authChanges((_, session) => {
      if (session) {
        this.session = session;
      
        this.errorMessage = null;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.twilioService.getAccessToken(this.session!.access_token!, 'login')
        .subscribe(({token}) => {
          if (token) {
              this.setCurrentUser();
              this.user.token = token;
              this.store.setCurrentUser(this.user);
              this.authService.signOut();
              this.router.navigate(['/chat']);
            } else this.errorMessage = 'Can not login. Try again later.';      
          });
      }
      });
  }
 
  async login() {
    try {
      await this.authService.signInWithGithub();    
    } catch (error) {
      this.errorMessage = 'Can not login. Try again later.';
    }
  }


  private setCurrentUser() {
    const user: User = {
      name: this.session?.user?.user_metadata?.['user_name'],
      email: this.session?.user?.user_metadata?.['email'],
      avatar_url: this.session?.user?.user_metadata?.['avatar_url'],
      fullname: this.session?.user?.user_metadata?.['full_name'],
      token: ''
    }
    this.user = user;
    this.store.setCurrentUser(user);

  }
 
}
