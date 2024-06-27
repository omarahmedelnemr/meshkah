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

    @Column({comment:"0 for Male, 1 For Woman"})
    sex!:boolean

    // Relations
    @ManyToMany(()=>Track,TrackID =>TrackID.id)
    @JoinTable()
    tracks!:Track

}
