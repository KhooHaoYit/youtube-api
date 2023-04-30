import { Module } from '@nestjs/common';
import { SharedSecretStrategy } from './sharedSecret.strategy';

@Module({
  imports: [],
  controllers: [],
  providers: [SharedSecretStrategy],
  exports: [],
})
export class AuthModule { }
