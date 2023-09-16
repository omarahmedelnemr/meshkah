import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Track } from "./Track"
import { Material } from "./Material"

@Entity()
@Unique(['id'])
export class Lecture {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({comment:"The Date of the Next Lecture"})
    nextDate:Date

    @Column({comment:"The Price that The Students Needs To Pay"})
    price:number


    //Relations
    @ManyToOne(()=>Track,trackID =>trackID.id)
    @JoinColumn()
    track:Track
}
