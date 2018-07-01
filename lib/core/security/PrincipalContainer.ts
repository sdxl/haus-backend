import { Principal } from "../security/Principal";
import { getManager } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../user/User";

export default class PrincipalContainer{
    constructor(){

    }

    async validatePrincipal(obj: any): Promise<User>{
        try{
            let tempPrincipal = await getManager().getRepository(Principal).find({ relations: ["subject"], where: {accessKey: obj.email}});
            let passwordStatus = await this.comparePassword(obj.password, tempPrincipal[0].passwordHash);
            if(passwordStatus == true){
                return tempPrincipal[0].subject;
            }else{
                return null;
            }
        }catch(e){

        }
    }

    async addNewPrincipal(obj: any): Promise<User>{
        try{
            let passwordHash = await this.hashPassword(obj.password);
            let principal = new Principal();
            let tempUser = new User();

            tempUser.firstName = obj.firstName;
            tempUser.lastName = obj.lastName;
            tempUser.email = obj.email;

            principal.accessKey = obj.email;
            principal.passwordHash = passwordHash;

            principal.subject = tempUser;

            let user = await getManager().save(tempUser);
            getManager().save(principal);

            return user;
        }catch(e){
            return null;
        }
    }

    private comparePassword(rawPassword: string, hashedPassword: string) : Promise<boolean>{
        return new Promise((resolve, reject) => {
            bcrypt.compare(rawPassword, hashedPassword, (err, res) => {
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            })
        })    
    }

    private hashPassword(rawPassword: string): Promise<string>{
        return new Promise((resolve, reject) => {
            bcrypt.hash(rawPassword, 10, (err, hash) => {
                if(err){
                    reject(err);
                }else{
                    resolve(hash);
                }
            })
        });
    }
}