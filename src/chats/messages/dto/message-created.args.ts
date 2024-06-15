import { IsNotEmpty } from '@nestjs/class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class MessageCreatedArgs {
	@Field()
	@IsNotEmpty()
	chatId: string;
}
