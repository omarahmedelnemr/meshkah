import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm"

@Entity()
@Unique(['id'])
export class Permissions {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    permission!: string

}
