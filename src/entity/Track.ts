import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, JoinColumn } from "typeorm"
import { Lecture } from "./Lecture"

@Entity()
@Unique(['id'])
export class Track {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    lecturesCount!:number

    @Column()
    attendingExpensis!:number

    // Relations
    @OneToMany(()=>Lecture,lectureID =>lectureID.id)
    lecture!:Lecture[]
}
