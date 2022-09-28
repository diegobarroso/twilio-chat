import { Injectable } from '@angular/core';
import { Conversation } from '@twilio/conversations';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
  public readonly currentUser: Observable<User> = this.currentUserSubject.asObservable();

  private activeConversationSubject: BehaviorSubject<Conversation> = new BehaviorSubject<Conversation>({} as Conversation);
  public readonly activeConversation: Observable<Conversation> = this.activeConversationSubject.asObservable();

  setCurrentUser(currentUser: User): void {
    this.currentUserSubject.next(currentUser);
  }

  setActiveConversation(activeConversation: Conversation): void {
    this.activeConversationSubject.next(activeConversation);
  }

}
