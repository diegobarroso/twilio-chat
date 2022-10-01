import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Conversation, Paginator } from '@twilio/conversations';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  constructor(private http: HttpClient) {}

  getAccessToken(token: string, action: string): Observable<{token:string}> {
    return this.http.get<{token:string}>('http://localhost:4000/auth/token', {headers: { token, action }});
    //return this.http.get<{token:string}>('https://chat-server-tbcf.onrender.com/auth/token', {headers: { token, action }})
  }
  
  // get user conversations
  getUserConversations(token: string): Promise<Conversation[]> {    
    const client = new Client(token);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Conversation[]> (async (resolve, reject) => {
      let paginator: Paginator<Conversation>;
      try {
        paginator = await client.getSubscribedConversations();
        resolve(paginator.items);
      } catch (error) {
        reject('Can not get user conversations');
      }
    })
  }


  createConversation(room: string, token: string): Promise<Conversation> {
    const client = new Client(token);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Conversation>(async (resolve, reject) => {
      try {
        const conversation = await client.createConversation({ uniqueName: room });
        conversation?.join();
        resolve(conversation);
        
      } catch (error) {
        reject('Conversation name already exists');
      }
          
      });
  }
    
  }



