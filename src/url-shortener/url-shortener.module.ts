import { Module } from '@nestjs/common';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schema/url-shortener.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
