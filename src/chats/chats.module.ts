import { forwardRef, Module } from '@nestjs/common';

import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepository } from './chats.repository';

import { MessagesModule } from './messages/messages.module';
import { Chat, ChatSchema } from './entities/chat.entity';

import { DatabaseModule } from 'src/common/database/database.module';

@Module({
	imports: [
		DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
		forwardRef(() => MessagesModule),
	],
	providers: [ChatsResolver, ChatsService, ChatsRepository],
	exports: [ChatsRepository, ChatsService],
})
export class ChatsModule {}
