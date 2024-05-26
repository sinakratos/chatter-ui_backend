import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { MessagesService } from './messages.service';

import { Message } from './entities/message.entity';

import { CreateMessageInput } from './dto/create-message.input';

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
}
