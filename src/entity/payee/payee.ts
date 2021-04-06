// External imports
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import { IsDefined, IsIBAN, IsOptional, IsString } from "class-validator"

// Internal imports
import { Payment } from "../payment/payment"

@Entity()
// @Unique(["name"])
export class Payee {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @IsDefined()
    @IsString()
    name: string

    @OneToMany(() => Payment, payment => payment.payee)
    payments: Payment[]
}
