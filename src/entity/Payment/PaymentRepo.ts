import {EntityRepository, Repository} from "typeorm"
import {Payment} from "./Payment"

@EntityRepository()
export class PaymentRepo extends Repository<Payment> {

    
}