import { Module, forwardRef } from '@nestjs/common';
import { YoutubeApi } from './api';
import { YoutubeScraper } from './scraper';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [],
  providers: [YoutubeApi, YoutubeScraper],
  exports: [YoutubeApi, YoutubeScraper],
})
export class YoutubeModule { }
