import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Conversation, Participant } from '@twilio/conversations';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './conversation-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationItemComponent implements OnInit{

  @Input() conversation!: Conversation;
  @Input() user!: string;
  @Output() delete: EventEmitter<Conversation> = new EventEmitter<Conversation>();
  showModal = false;
  participants!: Participant[];

  constructor(private router: Router,
              private store: StoreService) { }

  ngOnInit() {
    this.getParticipants();    
  }

  gotoConversation(conversation: Conversation) {
    this.store.setActiveConversation(conversation);
    this.router.navigate(['/', conversation.sid]);
  }

  deleteConversation(conversation: Conversation) {
    this.toggleModal();
    this.delete.emit(conversation);
  }

  toggleModal(){
    this.showModal = !this.showModal;
  }

  async getParticipants() {
    this.participants = await this.conversation.getParticipants();
  }

}
