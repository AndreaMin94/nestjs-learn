import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from './entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {

    // prendiamo la request object dall'execution context
    const request: Request = context.switchToHttp().getRequest();

    // estraiamo l'header che contiene il jwt
    const { authorization } = request.headers;

    // estraiamo il jwt
    const token = authorization?.split(' ')[1] || "";

    try {
      // verifichiamo che il token utilizzi il jwt
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get("JWT_SECRET")
      });
      // aggiungiamo il token alla proprietà user della richiesta
      request['user'] = payload;
    } catch(error) {
      throw new UnauthorizedException()
    }
    return true;
  }
}
