import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '@twilio/conversations';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {
	@Input() message!: Message
	@Input() user!: string;
  @Input() lastMessageAuthor!: string | null;
	@Output() play = new EventEmitter();

  speak() {
    this.play.emit();
  }

}
