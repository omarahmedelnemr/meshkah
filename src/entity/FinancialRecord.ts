import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from "typeorm"
import { Lecture } from "./Lecture"
import { Admin } from "./Admin"
import { Student } from "./Student"
import { Track } from "./Track"

@Entity()
@Unique(['id'])
export class FinancialRecord {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    paid!: boolean

    // @Column()
    // date!:Date

    //Relations
    @ManyToOne(()=>Track,trackID =>trackID.id)
    @JoinColumn()
    track!:Track

    @ManyToOne(()=>Lecture,lectureID =>lectureID.id)
    @JoinColumn()
    lecture!:Lecture

    @ManyToOne(()=>Admin,userID =>userID.id)
    @JoinColumn()
    admin!:Admin   //  The Admin Who Collected the Task Grades

    @ManyToOne(()=>Student,userID =>userID.id)
    @JoinColumn()
    student!:Student   //  The Student Who Made or Did'nt Made the Task
}
