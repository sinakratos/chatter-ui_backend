import { Injectable } from '@nestjs/common';

import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
	constructor(private readonly chatRepository: ChatsRepository) {}

	async create(createChatInput: CreateChatInput, userId: string) {
		return this.chatRepository.create({
			...createChatInput,
			userId,
			userIds: createChatInput.userIds || [],
			messages: [],
		});
	}

	userChatFilter(userId: string) {
		return {
			$or: [
				{ userId },
				{
					userIds: {
						$in: [userId],
					},
				},
				{ isPrivate: false },
			],
		};
	}

	async findAll(userId: string) {
		return this.chatRepository.find({
			...this.userChatFilter(userId),
		});
	}

	async findOne(_id: string) {
		return this.chatRepository.findOne({ _id });
	}

	update(id: number, updateChatInput: UpdateChatInput) {
		return `This action updates a #${id} chat`;
	}

	remove(id: number) {
		return `This action removes a #${id} chat`;
	}
}
