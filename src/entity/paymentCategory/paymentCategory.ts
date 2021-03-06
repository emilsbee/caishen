import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Payment } from "../payment/payment"

@Entity()
export class PaymentCategory {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string
    
    @OneToMany(() => Payment, payment => payment.category)
    payments: Payment[]
}