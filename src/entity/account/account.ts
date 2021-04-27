// External imports
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import {IsDefined, IsIBAN, IsInt, IsOptional, IsString, Validate} from "class-validator"

// Internal imports
import { Payment } from "../payment/payment"
import {IsOneOf} from "../../classValidators/IsInValidator"

/**
 * Account entity. Represents an account of various types such as a Bank account that has the feature
 * of listening to payments from the Bank's api. Not all banks have this though. Account can also be of 
 * type cash and crypto.
 */
@Entity()
export class Account {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @IsDefined()
    @IsString()
    name: string
    
    @Column({default: 0, nullable: true})
    @IsOptional()
    @IsInt()
    balance: number

    @Column()
    @IsDefined()
    @Validate(IsOneOf, ["Bank", "Crypto", "Cash"])
    @IsString()
    type: string

    @Column({nullable: true})
    @IsOptional()
    @IsIBAN()
    iban: string

    @Column()
    @IsDefined()
    @Validate(IsOneOf, ["EUR", "USD", "GBP"])
    @IsString()
    currency: string
    
    @Column({nullable:true})
    @IsOptional()
    @IsString()
    description: string
    
    @OneToMany(() => Payment, payment => payment.category)
    payments: Payment[]


}