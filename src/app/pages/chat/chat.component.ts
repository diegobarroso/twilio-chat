/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TwilioService } from '../../services/twilio.service';
import { Conversation } from '@twilio/conversations';
import { StoreService } from '../../services/store.service';
import { User } from 'src/app/interfaces/user';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {

  user!: User;
  inputTitle = new FormControl('');
  myConversations: Conversation[] = [];
  loading = false;
  error = false;
  errorMessage = '';

  constructor(private twilioService: TwilioService,
              private router: Router,
              private store: StoreService) {}

  
  ngOnInit(): void {
    this.store.currentUser.subscribe(user => {
      this.user = user;
      if (!user.token || user.token === '') this.router.navigate(['/']);
      // if (!user.token || user.token === '') this.logout();
    });
    this.getUserConversations();    
  }
  

  logout() {
    this.user.token = '';
    this.store.setCurrentUser(this.user);
    this.router.navigate(['/']);
  }

  async createConversation(){
    try {
      this.error = false;
      this.errorMessage = '';
      this.loading = true;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const conversation: Conversation = await this.twilioService.createConversation(this.inputTitle.value!, this.user.token);
      this.myConversations.unshift(conversation);
      this.inputTitle.setValue('');
    } catch (error) {
        this.error = true;
        this.errorMessage = 'String(error)';
    } finally {
      this.loading = false;
    }
  }

  async getUserConversations() {
    try {
      this.error = false;
      this.errorMessage = '';
      this.loading = true;
      this.myConversations = await this.twilioService.getUserConversations(this.user.token);
    } catch (error) {
      this.error = true;
        this.errorMessage = 'Can not get the conversations';
    } finally {
      this.loading = false;
    }
  }

  async deleteConversation(conversation: Conversation) {
    try {
      this.error = false;
      this.errorMessage = '';
      this.loading = true;
      await conversation.delete();
      this.myConversations = this.myConversations.filter(c => c.sid !== conversation.sid);
    } catch (error) {
      this.error = true;
        this.errorMessage = 'Can not delete the conversations';
    } finally {
      this.loading = false;
    }
  }

  validInputValue(): boolean {
    return this.inputTitle.value?.trim() !== '';
  }

}
