import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUrlDto } from './dtos/create-url.dto';
import { UrlShortenerService } from './url-shortener.service';
import { Response } from 'express';
import { Url } from './schema/url-shortener.schema';

@Controller('url')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post('createUrl')
  createUrl(@Body() createUrlDto: CreateUrlDto): Promise<Url> {
    return this.urlShortenerService.createUrl(createUrlDto);
  }

  @Get(':shortUrl')
  async getUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const recordModel = await this.urlShortenerService.getUrl(shortUrl);
      if (recordModel) {
        res.redirect(recordModel.longUrl);
      } else {
        res.status(HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
