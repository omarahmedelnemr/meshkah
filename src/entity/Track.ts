import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, JoinColumn, ManyToMany } from "typeorm"
import { Lecture } from "./Lecture"
import { Student } from "./Student"

@Entity()
@Unique(['id'])
export class Track {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    description!: string

    @Column()
    name!: string

    @Column()
    lecturesCount!:number

    @Column()
    attendingExpensis!:number

    @Column()
    openForEnrollment!:boolean
    
    @Column({nullable:true})
    lectureDate!:Date

    // Relations
    @OneToMany(()=>Lecture,lectureID =>lectureID.id)
    lecture!:Lecture[]

    @ManyToMany(()=>Student,studentID =>studentID.id)
    student!:Student
}
