import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Conversation, Message, Paginator, Participant } from '@twilio/conversations';
import { map, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { StoreService } from '../../services/store.service';
import { TwilioService } from '../../services/twilio.service';
import { GithubUserService } from '../../services/github-user.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit, OnDestroy {

  conversation!: Conversation;
  user!: User;
  messageInput = new FormControl('');
  addParticipantInput = new FormControl('');
  messages!: Message[];
  paginator!: Paginator<Message>;
  participants!: Participant[];
  loading = false;
  error = false;
  errorMessage = '';
  isEmojiPickerVisible!: boolean;
  validGithubUsername = false;
  checkingGithubUsername = false;
  errorGithubUsername = false;
  errorMessageGithubUsername = '';

  selectedVoice!: SpeechSynthesisVoice | null;
	voices!: SpeechSynthesisVoice[];
	rate = 1;


  constructor(private activatedRoute: ActivatedRoute,
              private store: StoreService,
              private router: Router,
              private twilioService: TwilioService,
              private githubUsername: GithubUserService) {
    this.voices = [];
    this.selectedVoice = null;
    this.voicesChanged();
  }

  ngOnDestroy(): void {
    speechSynthesis.cancel();
  }

  ngOnInit() {
    this.store.currentUser.subscribe(user => {
      this.user = user;
      if (!user.token || user.token === '') this.router.navigate(['/']);
    });

    this.store.activeConversation.subscribe(conversation => {
      this.conversation = conversation;
      this.activatedRoute.params.subscribe(params => {
        const room = params['room'];
        if (room !== this.conversation.sid) this.router.navigate(['/']);
      });
      this.conversation.getMessages()
      .then(paginator => {
        this.paginator = paginator;
        this.messages = paginator.items;
    });

    this.conversation.on('messageAdded', message => {
      this.messages.push(message);
    });

    this.getParticipants();

    this.addParticipantInput.valueChanges
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        map((username: string | null) => username!.trim()),
        debounceTime(500),
        distinctUntilChanged(),
        filter((username: string) => username !== ''),
        tap((username: string) => this.checkGithubUsername(username))
      )
    .subscribe();
    });

    // Get voices
    speechSynthesis.onvoiceschanged = () => this.voicesChanged();
  }


  async checkGithubUsername(username: string) {

    if (this.participants.find(p => p.identity === this.addParticipantInput.value) !== undefined) {
      this.errorGithubUsername = true;
      this.errorMessageGithubUsername = `${username} is already in the conversation`;
    } else {
      try {
        this.checkingGithubUsername = true;
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.status === 200) {
          this.validGithubUsername = true;
          this.errorGithubUsername = false;
          this.errorMessageGithubUsername = '';
        } else {
          this.validGithubUsername = false;
          this.errorGithubUsername = true;
          this.errorMessageGithubUsername = `${username} is not a valid github username`;
        }
      } catch (error) {
        this.validGithubUsername = false;
        this.errorGithubUsername = true;
        this.errorMessageGithubUsername = `${username} is not a valid username`;
      } finally {
          this.checkingGithubUsername = false;
      }
    }
    
        
        
  }
  

  sendMessage() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (this.messageInput && this.messageInput.value!.trim().length > 0) {
      this.conversation.sendMessage(this.messageInput.value)
        .then(() => {
          this.messageInput.setValue('');
          window.scrollTo(0, document.body.scrollHeight);
        });
      }
  }

  async addParticipant() {
    this.loading = true;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.twilioService.getAccessToken(this.addParticipantInput!.value!, 'add')
      .subscribe(async ({token}) => {
        try {
          await this.twilioService.getUserConversations(token);
          token = '';
        } catch (error) {
          this.errorMessage = '';
        }
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await this.conversation.add(this.addParticipantInput!.value!);
          this.getParticipants();
          this.addParticipantInput.setValue('');
        } catch (error) {
          this.error = true;
          this.errorMessage = 'Can not add participant';
        } finally {
          this.loading = false;
        }
      });

} 


  async deleteParticipant(participant: Participant) {
    this.loading = true;
    try {
      this.error = false;
      this.errorMessage = '';
      await this.conversation.removeParticipant(participant);
      this.getParticipants();
    } catch (error) {
      this.error = true;
      this.errorMessage = 'Can not delete participant';
    }
    finally {
      this.loading = false;
    }
    
  }

  async getParticipants() {
    this.loading = true;
    try {
      this.error = false;
      this.errorMessage = '';
      this.participants = await this.conversation.getParticipants();
    } catch (error) {
      this.error = true;
      this.errorMessage = 'Can not get participants';
    }
    finally {
      this.loading = false;
    }
  }

  validParticipant(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.addParticipantInput!.value!.trim().length > 0 && (this.participants.find(p => p.identity === this.addParticipantInput.value)) === undefined;
  }

  back() {
    this.router.navigate(['/chat']);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addEmoji(event: any) {
    this.messageInput.setValue(this.messageInput.value + event.emoji.native);
  }

  speak(message: string): void {
		if (!this.selectedVoice || !message) return;
		this.stop();
		this.synthesizeSpeechFromText(this.rate, message);
	}

  stop() : void {
		if (speechSynthesis.speaking) speechSynthesis.cancel();
	}

  private synthesizeSpeechFromText(rate: number, text: string): void {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.voice = this.selectedVoice;
		utterance.rate = rate;
		speechSynthesis.speak(utterance);
	}

  voicesChanged() {
    this.voices = speechSynthesis.getVoices();          
		this.selectedVoice = this.selectedVoice = this.voices.find(voice => voice.lang === 'es-ES') || this.voices[0];
  }

}
