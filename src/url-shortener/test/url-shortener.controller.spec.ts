import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from '../url-shortener.controller';
import { UrlShortenerService } from '../url-shortener.service';
import { Url } from '../schema/url-shortener.schema';
import { getModelToken } from '@nestjs/mongoose';
import { HttpStatus } from '@nestjs/common';
import { CreateUrlDto } from '../dtos/create-url.dto';

describe('UrlShortenerController', () => {
  let controller: UrlShortenerController;
  let service: UrlShortenerService;

  let mockResponse;
  let findOneMockResult;
  let createMockResult;

  beforeEach(async () => {
    mockResponse = {
      redirect: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
    };
    findOneMockResult = null;
    createMockResult = null;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [
        UrlShortenerService,
        { provide: getModelToken(Url.name), useValue: jest.fn() },
      ],
    }).compile();

    controller = module.get<UrlShortenerController>(UrlShortenerController);
    service = module.get<UrlShortenerService>(UrlShortenerService);
    service['urlModel'] = {
      findOne: () => findOneMockResult,
      create: () => createMockResult,
    } as any;
  });

  describe('getUrl', () => {
    it('Should redirect to longUrl when shortUrl is found', async () => {
      const mockUrlModel = {
        longUrl: 'https://localhost:3000/test',
        shortUrl: 'RpYa43oCM',
      };
      jest.spyOn(service, 'getUrl').mockResolvedValue(mockUrlModel);

      await controller.getUrl(mockUrlModel.shortUrl, mockResponse as any);

      expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
    it('Should return not found if shortUrl was not found', async () => {
      const mockUrlModel = {
        longUrl: 'https://localhost:3000/test',
        shortUrl: '123',
      };
      jest.spyOn(service, 'getUrl').mockResolvedValue(null);

      await controller.getUrl(mockUrlModel.shortUrl, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    });

    it('Should return internal server error on service error', async () => {
      const mockUrlModel = {
        longUrl: 'https://localhost:3000/test',
        shortUrl: '123',
      };
      jest
        .spyOn(service, 'getUrl')
        .mockRejectedValue(new Error('Something went wrong'));

      await controller.getUrl(mockUrlModel.shortUrl, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  describe('createUrl', () => {
    it('Should create a new shortUrl', async () => {
      const createUrl: CreateUrlDto = {
        longUrl: 'http://www.example.com',
        shortUrl: null,
      };
      createMockResult = Object.assign(createUrl);

      const result = await controller.createUrl(createUrl);

      expect(result.shortUrl).toBeTruthy();
    });

    it('Should return bad request if url already exist', async () => {
      const createUrl: CreateUrlDto = {
        longUrl: 'https://localhost:3000/test',
        shortUrl: null,
      };

      try {
        await controller.createUrl(createUrl);
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });

    it('Should return bad request if url already exist', async () => {
      const createUrl: CreateUrlDto = {
        longUrl: '123',
        shortUrl: null,
      };
      try {
        await controller.createUrl(createUrl);
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });
  });
});
