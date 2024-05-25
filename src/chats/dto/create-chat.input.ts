import { Transform } from '@nestjs/class-transformer';
import { InputType, Field } from '@nestjs/graphql';
import {
	IsArray,
	IsBoolean,
	IsEmpty,
	IsNotEmpty,
	IsOptional,
	IsString,
} from '@nestjs/class-validator';

@InputType()
export class CreateChatInput {
	@Field()
	@Transform(({ value }) => value === 'true')
	@IsBoolean()
	isPrivate: boolean;

	@Field(() => [String], { nullable: true })
	@IsArray()
	@IsString({ each: true })
	@IsEmpty({ each: true })
	@IsOptional()
	userIds?: string[];

	@Field({ nullable: true })
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	name?: string;
}
