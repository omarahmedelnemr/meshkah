import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from "typeorm"
import { Track } from "./Track"

@Entity()
@Unique(['id'])
export class Student {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    phone!: string

    @Column()
    sex!:string

    // Relations
    @ManyToMany(()=>Track,TrackID =>TrackID.id)
    @JoinTable()
    tracks!:Track

}
