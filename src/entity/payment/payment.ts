// External imports
import {CreateDateColumn, Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm"
import { IsCurrency, IsDefined, IsInstance, IsInt, IsOptional, IsString, Validate} from "class-validator"

// Internal imports
import { Account } from "../account/account"
import { Payee } from "../payee/payee"
import { PaymentCategory } from "../paymentCategory/paymentCategory"
import { PaymentTag } from "../paymentTag/paymentTag"
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

    @Column()
    @IsDefined()
    @Validate(IsOneOf, ["Income", "Expense"])
    type: string

    
    @ManyToOne(() => Account, account => account.payments, {
        eager: true
    })
    @IsDefined()
    @IsInstance(Account)
    account: Account

    @ManyToMany(() => PaymentTag, {
        eager: true,
        nullable: true
    })
    @JoinTable()
    tags: PaymentTag[]

    @Column({
        nullable: true
    })
    @IsOptional()
    @IsString()
    note: string

    @Column()
    @IsDefined()
    @IsCurrency()
    currency: string

    @Column({nullable: true})
    @IsOptional()
    @IsString()
    description: string
}