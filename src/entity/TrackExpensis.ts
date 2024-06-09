import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { Track } from "./Track"

@Entity()
@Unique(['id'])
export class TrackExpensis {

    @PrimaryGeneratedColumn({comment: "Additional Costs Like  Food"})
    id!: number

    @Column({comment: "The Title of the Spisific Amount of Expensis, like (150 for Food, 200 for Gifts)"})
    title!: string

    @Column()
    amount!:number

    @ManyToOne(()=>Track, trackID =>trackID.id)
    @JoinColumn()
    track!:Track
}
