import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";


@Entity({name:"users"})
export class User extends CoreEntity{
    @Column({ unique: true })
    @Field((type) => String)
    @IsEmail()
    email: string;
}