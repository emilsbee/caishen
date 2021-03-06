import {Entity, Column, PrimaryGeneratedColumn, ManyToMany} from "typeorm"
import { Payment } from "../payment/payment"

@Entity()
export class PaymentTag {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @ManyToMany(() => Payment)
    payments: Payment[]
}