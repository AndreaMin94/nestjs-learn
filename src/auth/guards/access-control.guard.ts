import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../entities/user.entity";

@Injectable()
export class AccessControlGuard implements CanActivate {
    constructor(private reflector: Reflector){
        console.log("#### CIAONE")
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);

        console.log(`#### ROLES : ${roles}`);

        if(!roles){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log("######## request user : ", user);
        console.log("###### roles : ", roles);
        console.log("###### roles includes : ", roles.includes(user.role));
        return roles.includes(user.role);
    }
}