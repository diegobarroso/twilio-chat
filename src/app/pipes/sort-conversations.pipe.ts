import { Pipe, PipeTransform } from '@angular/core';
import { Conversation } from '@twilio/conversations';

@Pipe({
  name: 'sortConversations'
})
export class SortConversationsPipe implements PipeTransform {

  transform(conversations: Conversation[]): Conversation[] {
    return conversations.sort((a, b) => {
      if (a.dateUpdated! < b.dateUpdated!) return 1;
      else return -1; 
    });
  }
}
