import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant } from '@twilio/conversations';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParticipantComponent {
  @Input() participant!: Participant;
  @Input() user!: string;
  @Input() createdBy!: string;
  @Output() delete: EventEmitter<Participant> = new EventEmitter<Participant>();
  showModal = false;
  

  deleteParticipant(participant: Participant) {
    this.delete.emit(participant);
  }

  toggleModal(){
    this.showModal = !this.showModal;
  }
}
