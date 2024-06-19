import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from "typeorm"
import { Lecture } from "./Lecture"
import { Student } from "./Student"
import { Track } from "./Track"

@Entity()
@Unique(['id'])
export class Attendance {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({comment:"Weather the Student Attended or Not, 0 for Not, 1 for Attended, 2 for attended Late"})
    attended!:number
    

    //Relations
    @ManyToOne(()=>Lecture,lectureID =>lectureID.id)
    @JoinColumn()
    lecture!:Lecture

    @ManyToOne(()=>Track,trackID =>trackID.id)
    @JoinColumn()
    track!:Track

    // @ManyToOne(()=>Student,userID =>userID.id)
    // @JoinColumn()
    // admin!:Student   //  The Admin Who Collected the Task Grades

    @ManyToOne(()=>Student,userID =>userID.id)
    @JoinColumn()
    student!:Student   //  The Student Who Made or Did'nt Made the Task

}
