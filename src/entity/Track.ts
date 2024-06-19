import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, JoinColumn, ManyToMany } from "typeorm"
import { Lecture } from "./Lecture"
import { Student } from "./Student"
import { IsIn, Matches } from "class-validator";

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
    
    @Column({ nullable: true, comment: "The Day of the Week for the Lecture" })
    @IsIn(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    lectureDay!:string

    @Column({ nullable: true, comment: "The Time for the Lecture" })
    @Matches(/^(0?[1-9]|1[012]):[0-5][0-9](?:AM|PM)$/i, { message: "Time must be in format hh:mmAM/PM" })
    lectureTime!:string

    // Relations
    @OneToMany(()=>Lecture,lectureID =>lectureID.id)
    lecture!:Lecture[]

    @ManyToMany(()=>Student,studentID =>studentID.id)
    student!:Student
}
