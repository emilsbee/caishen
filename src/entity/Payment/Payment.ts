import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm"
import { Payee } from "../Payee/Payee"

@Entity()
export class Payment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    date: number
    
    @Column()
    amount: number

    @ManyToOne(() => Payee, payee => payee.payments, {
        eager: true
    })
    payee: Payee


}