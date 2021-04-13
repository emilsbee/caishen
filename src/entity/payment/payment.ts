// External imports
import {CreateDateColumn, Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterInsert, getManager } from "typeorm"
import { IsDefined, IsInstance, IsInt, IsOptional, IsString, Validate} from "class-validator"

// Internal imports
import { Account } from "../account/account"
import { Payee } from "../payee/payee"
import { PaymentCategory } from "../paymentCategory/paymentCategory"
import { IsOneOf } from "../../classValidators/IsInValidator"

@Entity()
export class Payment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn()
    date: number
    
    @ManyToOne(() => Payee, payee => payee.payments, {
        eager: true,
        nullable: true
    })
    @IsOptional()
    @IsInstance(Payee)
    payee: Payee
    
    
    @ManyToOne(() => PaymentCategory, paymentCategory => paymentCategory.payments, {
        eager: true,
        nullable: true
    })
    @IsOptional()
    @IsInstance(PaymentCategory)
    category: PaymentCategory

    @Column()
    @IsDefined()
    @IsInt()
    amount: number
    
    @ManyToOne(() => Account, account => account.payments, {
        eager: true
    })
    @IsDefined()
    @IsInstance(Account)
    account: Account

    @Column()
    @IsDefined()
    @Validate(IsOneOf, ["EUR", "USD", "GBP"])
    currency: string

    @Column({nullable: true})
    @IsOptional()
    @IsString()
    description: string

    @AfterInsert()
    async adjustBalance() {
        let manager = getManager()
        await manager.update(Account, this.account.id, {balance: this.account.balance + this.amount})
    }
}