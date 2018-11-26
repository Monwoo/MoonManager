import { UrlTransformerPipe } from './url-transformer.pipe';

describe('UrlTransformerPipe', () => {
  it('create an instance', () => {
    const pipe = new UrlTransformerPipe();
    expect(pipe).toBeTruthy();
  });
});
