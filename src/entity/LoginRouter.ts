import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm"
import { Student } from "./Student"
import { Admin } from "./Admin"

@Entity()
@Unique(['id','username',"email"])
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
    @OneToOne(()=>Student,userID=> userID.id)
    @JoinColumn()
    student!:Student

    // Relations
    @OneToOne(()=>Admin,adminID=> adminID.id)
    @JoinColumn()
    admin!:Admin
}
