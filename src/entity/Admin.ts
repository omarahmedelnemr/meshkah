import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable } from "typeorm"
import { Track } from "./Track"
import { Permissions } from "./Permissions"

@Entity()
@Unique(['id'])
export class Admin {

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
    @JoinTable({name:"assigned_tracks"})
    tracks!:Track[]

    @ManyToMany(()=>Permissions,TrackID =>TrackID.id)
    @JoinTable({name:"admin_permissions"})
    permissions!:Permissions[]


}
