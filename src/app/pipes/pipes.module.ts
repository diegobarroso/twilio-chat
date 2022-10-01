import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortConversationsPipe } from './sort-conversations.pipe';



@NgModule({
  declarations: [
    SortConversationsPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortConversationsPipe
  ]
})
export class PipesModule { }
