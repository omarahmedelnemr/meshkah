import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import { Admin } from "./Admin"

@Entity()
@Unique(['id','username'])
export class LoginRouter {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    username!: string

    @Column()
    password!: string

    @Column()
    email!: string

    @Column({comment:"0 for user, 1 For Admin"})
    userType!: boolean

    // Relations
    @OneToOne(()=>User,userID=> userID.id)
    @JoinColumn()
    user!:User

    // Relations
    @OneToOne(()=>Admin,adminID=> adminID.id)
    @JoinColumn()
    admin!:Admin
}
