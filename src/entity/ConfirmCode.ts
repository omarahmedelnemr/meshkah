import { Entity, PrimaryColumn, Column, Unique } from "typeorm"


@Entity()
@Unique(['email'])
export class ConfirmCode{

    @PrimaryColumn()
    email!: string

    @Column()
    code!: string

    @Column()
    expiration!: Date

}
