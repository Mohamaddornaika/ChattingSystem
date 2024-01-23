import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatListPageRoutingModule } from './chat-list-routing.module';

import { ChatListPage } from './chat-list.page';
import { ChatFormComponent } from '../../chat-form/chat-form.component'; // Adjust the path accordingly

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatListPageRoutingModule],
  declarations: [ChatListPage, ChatFormComponent],
})
export class ChatListPageModule {}
