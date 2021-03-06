// External imports
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import {IsDefined, IsIBAN, IsInt, IsOptional, IsString, Validate} from "class-validator"

// Internal imports
import { Payment } from "../payment/payment"
import {IsOneOf} from "../../classValidators/IsInValidator"

@Entity()
export class Account {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @IsDefined()
    @IsString()
    name: string
    
    @Column()
    @IsDefined()
    @IsInt({message: "Balance must be an integer."})
    balance: number

    @Column()
    @Validate(IsOneOf, ["Bank", "Crypto", "Cash"])
    @IsString()
    type: string

    @Column({
        nullable: true
    })
    @IsOptional()
    @IsIBAN()
    iban: string

    @Column({
        nullable: true
    })
    @IsOptional()
    @IsInt()
    bunqid: number
    
    @OneToMany(() => Payment, payment => payment.category)
    payments: Payment[]
}