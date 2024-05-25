import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

import { CreateChatInput } from './create-chat.input';

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
	@Field(() => Int)
	id: number;
}
