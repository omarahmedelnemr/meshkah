import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from "typeorm"
import { Lecture } from "./Lecture"

@Entity()
@Unique(['id'])
export class Material {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string
    
    @Column({comment:"wheather a Video to Be Embedded or just a Link"})
    video!:boolean

    @Column()
    link!:string

    // Relations
    @ManyToOne(()=>Lecture,lectureID => lectureID.id)
    @JoinColumn()
    lecture!:Lecture
}
