import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from "typeorm"
import { Lecture } from "./Lecture"
import { Student } from "./Student"

@Entity()
@Unique(['id'])
export class Attendance {

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

    @ManyToOne(()=>Student,userID =>userID.id)
    @JoinColumn()
    admin!:Student   //  The Admin Who Collected the Task Grades

    @ManyToOne(()=>Student,userID =>userID.id)
    @JoinColumn()
    student!:Student   //  The Student Who Made or Did'nt Made the Task

}
