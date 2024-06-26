import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from "typeorm"
import { Lecture } from "./Lecture"

@Entity()
@Unique(['id'])
export class Task {

    @PrimaryGeneratedColumn()
    id!: number

    
    @Column()
    title!:string

    // Relations
    @ManyToOne(()=>Lecture,lectureID =>lectureID.id)
    @JoinColumn()
    lecture!:Lecture

}
