import { Database } from "../../data-source";
import { Admin } from "../../entity/Admin";
import { ConfirmCode } from "../../entity/ConfirmCode";
import { LoginRouter } from "../../entity/LoginRouter";
import { User } from "../../entity/User";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";
import SendMail from "../../middleware/sendMail";
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
        const missing = checkUndefined(reqData,['email'])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // check If Eamil is in the Database
            const user = await Database.getRepository(LoginRouter).findOneBy({email:reqData['email']})
            if (! user){
                return responseGenerator.notFound
            }
            const newConfirmCode = new ConfirmCode()
            newConfirmCode.email = reqData['email'] 
            newConfirmCode.code = String( Math.floor(1000 + Math.random() * 9000))
            newConfirmCode.expiration =  new Date(Date.now() + 2 * 60 * 1000);  // Two Minutes
            await Database.getRepository(ConfirmCode).save(newConfirmCode)

            SendMail(reqData['email'],"Reset Your Password","<h2>اهلا بيك,</h2><p>الرقم التالي هو الرقم التاكيدي لتغيير كلمة السر, برجاء عدم مشاركته </p><h3>Code: "+newConfirmCode.code+"</h3>")
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Resetting New Password Function Model
    async reset_password(reqData:object){
        const missing = checkUndefined(reqData,["email",'code','newPassword'])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Check if user Exist
            const user = await Database.getRepository(LoginRouter).findOneBy({email:reqData['email']})
            if(!user){
                return responseGenerator.notFound
            }
            const codeData = await Database.getRepository(ConfirmCode).findOneBy({email:reqData['email']})    
            if (!codeData){
                return responseGenerator.notFound
            }
            else if (codeData.code !== reqData['code']){
                return responseGenerator.sendError("الرمز التاكيدي خاطئ")
            }
            else if (new Date(codeData.expiration) < new Date()){
                return responseGenerator.sendError("انتهت صلاحية الرمز التاكيدي ")
            }

            // Remove Confirmation Code from DB
            await Database
            .getRepository(ConfirmCode)
            .createQueryBuilder('ConfirmCode')
            .delete()
            .from(ConfirmCode)
            .where("email = :email", { email: reqData['email'] })
            .execute()

            user.password = await bcrypt.hash(reqData["newPassword"],10)
            await Database.getRepository(LoginRouter).save(user)
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new AuthenticationModel();
