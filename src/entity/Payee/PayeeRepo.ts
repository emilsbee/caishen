import {EntityRepository, Repository} from "typeorm"
import {Payee} from "./Payee"

@EntityRepository()
export class PayeeRepo extends Repository<Payee> {

    
}