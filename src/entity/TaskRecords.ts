import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from "typeorm"
import { Lecture } from "./Lecture"
import { Student } from "./Student"
import { Task } from "./Tasks"

@Entity()
@Unique(['id'])

// The Records That Tells Weather Each Student Made the Lecture Tasks or Not
export class TaskRecord {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({comment:"How Much of The Task is Done"})
    done!:number
    

    //Relations
    @ManyToOne(()=>Task,taskID =>taskID.id)
    @JoinColumn()
    task!:Task

    @ManyToOne(()=>Student,userID =>userID.id)
    @JoinColumn()
    admin!:Student   //  The Admin Who Collected the Task Grades

    @ManyToOne(()=>Student,userID =>userID.id)
    @JoinColumn()
    student!:Student   //  The Student Who Made or Did'nt Made the Task

}
