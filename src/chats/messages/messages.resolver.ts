import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

import { MessagesService } from './messages.service';

import { CreateMessageInput } from './dto/create-message.input';
import { GetMessagesArgs } from './dto/get-messages.args';
import { MessageCreatedArgs } from './dto/message-created.args';
import { Message } from './entities/message.entity';

import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { TokenPayload } from '../../auth/token-payload.interface';

import { PUB_SUB } from 'src/common/constants/injection-token';

@Resolver(() => Message)
export class MessagesResolver {
	constructor(
		private readonly messagesService: MessagesService,
		@Inject(PUB_SUB) private readonly pubSub: PubSub
	) {}

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

	@Subscription(() => Message, {
		filter: (payload, variables, context) => {
			const userId = context.req.user._id;
			return (
				payload.messageCreated.chatId === variables.chatId &&
				userId !== payload.messageCreated.userId
			);
		},
	})
	messageCreated(
		@Args() messageCreatedArgs: MessageCreatedArgs,
		@CurrentUser() user: TokenPayload
	) {
		return this.messagesService.messageCreated(
			messageCreatedArgs,
			user._id
		);
	}
}
