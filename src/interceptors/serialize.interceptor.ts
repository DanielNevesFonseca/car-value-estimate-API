import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface IClassConstructor {
  new (...args: any[]): {};
}

// Criando seu próprio @decorator!!!
export function Serialize(dto: IClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// Middleware/Interceptor para retirar os campos inválidos do corpo da requisição.
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
