import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ChatsModule } from './chats/chats.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { DatabaseModule } from './common/database/database.module';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				MONGODB_URI: Joi.string().required(),
			}),
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: (AuthService: AuthService) => ({
				autoSchemaFile: true,
				subscriptions: {
					'graphql-ws': {
						onConnect: (context: any) => {
							try {
								const request: Request = context.extra.request;
								const user = AuthService.verifyWs(request);
								context.user = user;
							} catch (err) {
								new Logger().error(err);
								throw new UnauthorizedException();
							}
						},
					},
				},
			}),
			imports: [AuthModule],
			inject: [AuthService],
		}),
		DatabaseModule,
		UsersModule,
		LoggerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				const isProduction =
					configService.get('NODE_ENV') === 'production';
				return {
					pinoHttp: isProduction
						? undefined
						: {
								transport: {
									target: 'pino-pretty',
									options: {
										singleLine: true,
									},
								},
								level: isProduction ? 'info' : 'debug',
						  },
				};
			},
			inject: [ConfigService],
		}),
		AuthModule,
		ChatsModule,
		PubSubModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
