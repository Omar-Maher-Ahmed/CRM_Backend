import { Module } from "@nestjs/common";
import { UsersService } from "./user.service";
import { UsersResolver  } from "./user.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";





@Module({
    imports:[
      TypeOrmModule.forFeature([User]),
    ],
      // controllers: [ ],
      providers: [UsersService,UsersResolver],
      exports: [UsersService]
})
export class UserModule{

}