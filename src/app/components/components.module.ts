import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './shared/loader/loader.component';
import { MessageComponent } from './message/message.component';
import { ParticipantComponent } from './participant/participant.component';
import { ConversationItemComponent } from './conversation-item/conversation-item.component';



@NgModule({
  declarations: [
    LoaderComponent,
    MessageComponent,
    ParticipantComponent,
    ConversationItemComponent
  ],
  exports: [
    LoaderComponent,
    MessageComponent,
    ParticipantComponent,
    ConversationItemComponent
  ],
  imports: [ 
    CommonModule,
  ]
})
export class ComponentsModule { }
