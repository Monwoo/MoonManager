import { Pipe, PipeTransform } from '@angular/core';
import { MediasBufferService } from '../services/medias-buffer.service';

@Pipe({
  name: 'urlTransformer'
})
export class UrlTransformerPipe implements PipeTransform {
  constructor(private medias: MediasBufferService) {}

  transform(value: any, args?: any): any {
    let matches = value.match(/moon-manager:\/\//);
    if (matches) {
      return this.medias.getDataUrlMedia(value);
    }
    return value;
  }
}
