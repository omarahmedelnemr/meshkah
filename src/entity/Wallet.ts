import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToOne, JoinColumn } from "typeorm"
import { Track } from "./Track"
import { Student } from "./Student"

@Entity()
@Unique(['id'])
export class Wallet {

    @PrimaryGeneratedColumn({comment: "Additional Costs Like  Food"})
    id!: number

    @Column()
    value!:number

    // Relations
    @ManyToOne(()=>Student, studentID =>studentID.id)
    @JoinColumn()
    student!:Student

    @ManyToOne(()=>Track, trackID =>trackID.id)
    @JoinColumn()
    track!:Track
}
