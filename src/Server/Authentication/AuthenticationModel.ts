import { Database } from "../../data-source";
import { Admin } from "../../entity/Admin";
import { LoginRouter } from "../../entity/LoginRouter";
import { User } from "../../entity/User";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

class AuthenticationModel{

    // Login Function Model
    async login(reqData:object){
        const missing = checkUndefined(reqData,["username","password"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Parameters
            const username = reqData['username']
            const password = reqData['password']

            // Getting User's Info
            const user = await Database.getRepository(LoginRouter).findOneBy({username:username})
            if (!user){
                return responseGenerator.notFound
            }

            // Check Password Correctness
            if(! await bcrypt.compare(password, user.password)){  
                return responseGenerator.wrongPassword
            }



            var userInfo;
            
            // Check Users Role
            if (user['userType']){
                 userInfo = await Database.getRepository(Admin)
                    .createQueryBuilder('user')
                    .innerJoinAndSelect('LoginRouter',"LoginRouter")
                    .where('LoginRouter.id = :adminId', { adminId: user.id })
                    .getOne();
            }else{
                 userInfo = await Database.getRepository(User)
                    .createQueryBuilder('user')
                    .innerJoinAndSelect('LoginRouter',"LoginRouter")
                    .where('LoginRouter.id = :adminId', { adminId: user.id })
                    .getOne();
            }


            const JWTInfo = {
                "id":userInfo['id'],
                'email':user['email'],
                "role":user['userType']
            }

            //Generat JWT That Last For 10 Days
            var genratedJWT = jwt.sign( JWTInfo,process.env.JWTsecret,{ expiresIn: 60 * 60 *24*10 } ) 

            // Add The MetaData
            userInfo['email'] = user['email']
            userInfo['userType'] = user['userType'] ? "admin":"user"
            userInfo['jwt'] = genratedJWT

            return responseGenerator.sendData(userInfo)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Sending Email Function Model
    async send_email(reqData:object){
        const missing = checkUndefined(reqData,[])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Resetting New Password Function Model
    async reset_password(reqData:object){
        const missing = checkUndefined(reqData,[])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new AuthenticationModel();
