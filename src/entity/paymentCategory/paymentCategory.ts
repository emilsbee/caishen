import { IsDefined, IsString } from "class-validator"
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { Payment } from "../payment/payment"

@Entity()
export class PaymentCategory {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @IsDefined()
    @IsString()
    name: string
    
    @OneToMany(() => Payment, payment => payment.category)
    payments: Payment[]
}