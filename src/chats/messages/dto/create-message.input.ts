import { IsNotEmpty } from '@nestjs/class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
	@Field()
	@IsNotEmpty()
	content: string;

	@Field()
	@IsNotEmpty()
	chatId: string;
}
