import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dtos/create-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from './schema/url-shortener.schema';
import { Model } from 'mongoose';
import * as shortid from 'shortid';

@Injectable()
export class UrlShortenerService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async createUrl(createUrlDto: CreateUrlDto): Promise<Url> {
    const IsUrl: boolean = this.chechRegExp(createUrlDto.longUrl);
    if (!IsUrl) {
      throw new HttpException('Not Url', HttpStatus.BAD_REQUEST);
    }

    const newUrl: string = shortid.generate();
    createUrlDto.shortUrl = newUrl;

    const existUrl = await this.urlModel.findOne({
      longUrl: createUrlDto.longUrl,
    });
    if (existUrl) {
      throw new HttpException(
        'This url has already been shortened',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const recordModel = await this.urlModel.create(createUrlDto);
      return recordModel;
    }
  }

  async getUrl(shortUrl: string): Promise<Url | null> {
    const model = await this.urlModel.findOne({ shortUrl });
    return model;
  }

  chechRegExp(url: string) {
    const reg =
      /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return reg.test(url);
  }
}
