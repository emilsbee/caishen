import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Payment } from "../Payment/Payment"

@Entity()
export class Payee {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string


    @OneToMany(() => Payment, payment => payment.payee)
    payments: Payment[]
}