import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, JoinColumn } from "typeorm"
import { TrackExpensis } from "./TrackExpensis"
import { Lecture } from "./Lecture"

@Entity()
@Unique(['id'])
export class Track {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    capacity:number

    // Relations
    @OneToMany(()=>TrackExpensis,trackExpensisID =>trackExpensisID.id)
    expensis:TrackExpensis[]


    @OneToMany(()=>Lecture,lectureID =>lectureID.id)
    lecture:Lecture[]
}
