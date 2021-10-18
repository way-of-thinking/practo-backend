import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ok';
  }

  getHealth(): string {
    return 'ok';
  }
}
