import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Track } from "./Track"
import { Material } from "./Material"

@Entity()
@Unique(['id'])
export class Lecture {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    //Relations
    @ManyToOne(()=>Track,trackID =>trackID.id)
    @JoinColumn()
    track!:Track
}
