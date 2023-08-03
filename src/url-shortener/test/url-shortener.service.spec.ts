import { UrlShortenerService } from '../url-shortener.service';

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;

  beforeAll(async () => {
    service = new UrlShortenerService({} as any);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('chechRegExp', () => {
    it('Should return true if url is correct', async () => {
      const mockValue = 'http://www.example.com';
      const result = service.chechRegExp(mockValue);

      expect(result).toBe(true);
    });

    it('Should return false if url is incorrect', async () => {
      const mockValue = '123';
      const result = service.chechRegExp(mockValue);

      expect(result).toBe(false);
    });
  });
});
