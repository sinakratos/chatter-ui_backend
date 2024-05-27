import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { MessagesService } from './messages.service';

import { CreateMessageInput } from './dto/create-message.input';
import { GetMessagesArgs } from './dto/get-messages.args';
import { Message } from './entities/message.entity';

import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { TokenPayload } from '../../auth/token-payload.interface';

@Resolver(() => Message)
export class MessagesResolver {
	constructor(private readonly messagesService: MessagesService) {}

	@Mutation(() => Message)
	@UseGuards(GqlAuthGuard)
	async createMessage(
		@Args('createMessageInput') createMessageInput: CreateMessageInput,
		@CurrentUser() user: TokenPayload
	) {
		return this.messagesService.createMessage(createMessageInput, user._id);
	}

	@Query(() => [Message], { name: 'messages' })
	@UseGuards(GqlAuthGuard)
	async getMessages(
		@Args() getMessageArgs: GetMessagesArgs,
		@CurrentUser() user: TokenPayload
	) {
		return this.messagesService.getMessages(getMessageArgs, user._id);
	}
}
