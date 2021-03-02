import {EntityRepository, Repository} from "typeorm"
import {Payee} from "./payee"

@EntityRepository()
export class PayeeRepo extends Repository<Payee> {

    
}