import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm"
import { Payee } from "../payee/payee"

@Entity()
export class Payment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    date: number
    
    @ManyToOne(() => Payee, payee => payee.payments, {
        eager: true
    })
    payee: Payee
    
    
    
    @Column()
    amount: number



}