import {Unique, Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Payment } from "../payment/payment"
import { IsPayeeAlreadyExist } from "../../classValidators/IsUniquePayeeValidator"

@Entity()
@Unique(["name"])
export class Payee {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @IsPayeeAlreadyExist({message: "A payee with the given name alrady exists."})
    name: string

    @Column({
        nullable: true
    })
    iban: string

    @OneToMany(() => Payment, payment => payment.payee)
    payments: Payment[]
}
