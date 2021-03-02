import {EntityRepository, Repository} from "typeorm"
import {Payment} from "./payment"

@EntityRepository()
export class PaymentRepo extends Repository<Payment> {

    
}