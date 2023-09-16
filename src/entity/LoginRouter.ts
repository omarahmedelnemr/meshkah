import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
@Unique(['id','username'])
export class LoginRouter {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string


    // Relations
    @OneToOne(()=>User,userID=> userID.id)
    @JoinColumn()
    user:User

}
