import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from "typeorm"

@Entity()
@Unique(['id'])
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    phone: string

    @Column()
    sex:string
    
    @Column()
    role:string

    @Column()
    track:string

}
