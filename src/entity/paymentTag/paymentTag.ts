import { IsDefined, IsString } from "class-validator"
import {Entity, Column, PrimaryGeneratedColumn, ManyToMany} from "typeorm"
import { Payment } from "../payment/payment"

@Entity()
export class PaymentTag {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @IsDefined()
    @IsString()
    name: string

    @Column()
    @IsDefined()
    @IsString()
    description: string

    @ManyToMany(() => Payment)
    payments: Payment[]
}