import { Database } from "../../data-source";
import { LoginRouter } from "../../entity/LoginRouter";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";
const bcrypt = require("bcrypt")

class SettingsModel{
    // Change User's Username
    async change_username(reqData:object){
        const missing = checkUndefined(reqData,["userID","password","newUsername"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const loginInfo = await Database.getRepository(LoginRouter).findOneBy({student:{id:reqData["userID"]}})
            if (!loginInfo){
                return responseGenerator.notFound
            }else if (! await bcrypt.compare(reqData['password'],loginInfo.password) ){
                return responseGenerator.wrongPassword
            }
            // check if Doesn't Exist 
            const testUsername = await Database.getRepository(LoginRouter).findOneBy({username:reqData['newUsername']})
            if (testUsername){
                return responseGenerator.usernameAlreadyExist
            }

            // Save to Database
            loginInfo.username = reqData['newUsername']
            await Database.getRepository(LoginRouter).save(loginInfo)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Change User's Password
    async change_password(reqData:object){
        const missing = checkUndefined(reqData,["userID","oldPassword","newPassword"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const loginInfo = await Database.getRepository(LoginRouter).findOneBy({student:{id:reqData["userID"]}})
            if (!loginInfo){
                return responseGenerator.notFound
            }else if (! await bcrypt.compare(reqData['oldPassword'],loginInfo.password) ){
                return responseGenerator.wrongPassword
            }

            // Save to Database
            loginInfo.password = await bcrypt.hash(reqData['newPassword'],10)
            await Database.getRepository(LoginRouter).save(loginInfo)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new SettingsModel();
