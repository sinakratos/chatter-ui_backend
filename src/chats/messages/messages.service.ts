import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { ChatsRepository } from '../chats.repository';

import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';

@Injectable()
export class MessagesService {
	constructor(private readonly chatsRepository: ChatsRepository) {}

	async createMessage(
		{ content, chatId }: CreateMessageInput,
		userId: string
	) {
		const message: Message = {
			content,
			userId,
			createdAt: new Date(),
			_id: new Types.ObjectId(),
		};
		await this.chatsRepository.findOneAndUpdate(
			{
				_id: chatId,
				$or: [
					{ userId },
					{
						userIds: {
							$in: [userId],
						},
					},
				],
			},
			{
				$push: {
					messages: message,
				},
			}
		);
		return message;
	}
}
