import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AppHandleUpdate } from './app.handleUpdate';
import { YoutubeModule } from './youtube/module';
import { AuthModule } from './auth/module';
import { APP_GUARD } from '@nestjs/core';
import { SharedSecretAuthGuard } from './auth/sharedSecret.strategy';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true || './prisma/schema.graphql',
    // }),
    YoutubeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppResolver,
    AppService,
    AppHandleUpdate,
    {
      provide: APP_GUARD,
      useClass: SharedSecretAuthGuard,
    },
  ],
  exports: [AppHandleUpdate],
})
export class AppModule { }
