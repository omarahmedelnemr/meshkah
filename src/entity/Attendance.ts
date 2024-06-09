import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from "typeorm"
import { Lecture } from "./Lecture"
import { User } from "./User"

@Entity()
@Unique(['id'])
export class Task {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column({comment:"Weather the Student Attended or Not"})
    attended!:boolean
    

    //Relations
    @ManyToOne(()=>Lecture,lectureID =>lectureID.id)
    @JoinColumn()
    lecture!:Lecture

    @ManyToOne(()=>User,userID =>userID.id)
    @JoinColumn()
    admin!:Lecture   //  The Admin Who Collected the Task Grades

    @ManyToOne(()=>User,userID =>userID.id)
    @JoinColumn()
    student!:Lecture   //  The Student Who Made or Did'nt Made the Task

}
