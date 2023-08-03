import { Module } from '@nestjs/common';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UrlShortenerModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017'),
  ],
})
export class AppModule {}
