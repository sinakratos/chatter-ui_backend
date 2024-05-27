import { IsNotEmpty } from '@nestjs/class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetMessagesArgs {
	@Field()
	@IsNotEmpty()
	chatId: string;
}
