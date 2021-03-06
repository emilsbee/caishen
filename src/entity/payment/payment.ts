// External imports
import {CreateDateColumn, Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from "typeorm"

// Internal imports
import { Account } from "../account/account"
import { Payee } from "../payee/payee"
import { PaymentCategory } from "../paymentCategory/paymentCategory"
import { PaymentTag } from "../paymentTag/paymentTag"

@Entity()
export class Payment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn()
    date: number
    
    @ManyToOne(() => Payee, payee => payee.payments, {
        eager: true
    })
    payee: Payee
    
    
    @ManyToOne(() => PaymentCategory, paymentCategory => paymentCategory.payments, {
        eager: true
    })
    category: PaymentCategory

    @Column()
    amount: number

    @Column({
        enum: ["Income", "Expense"],
    })
    type: string

    
    @ManyToOne(() => Account, account => account.payments, {
        eager: true
    })
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
    note: string

    @Column()
    currency: string

    @Column()
    description: string
}