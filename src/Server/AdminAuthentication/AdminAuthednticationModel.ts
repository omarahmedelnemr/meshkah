import { Database } from "../../data-source";
import { Admin } from "../../entity/Admin";
import { LoginRouter } from "../../entity/LoginRouter";
import { Permissions } from "../../entity/Permissions";
import { Track } from "../../entity/Track";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";
var jwt = require('jsonwebtoken');

class AdminAuthednticationModel{
    
    // Signup Function For Admins
    async AdminSignup(reqData:object){
        const missing = checkUndefined(reqData,["username","password","email","token","name","phone","sex"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{

            // Check Token Validity and it's Content
            var jwtData;
            try{
                jwtData = await jwt.verify(reqData['token'],process.env.JWTsecret)
                if( !jwtData['tracks'] || !jwtData['permissions']){
                    throw Error("Invalid Content of the JWT")
                }
            }catch(err){
                return responseGenerator.sendError("The Token is Invalid")
            }

            // Check username if Exist
            const CheckExist = await Database.getRepository(LoginRouter).findOneBy({username:reqData['username']})
            if(CheckExist){
                return responseGenerator.usernameAlreadyExist
            }

            // Get Permissions From Token
            const permissions = await Database.getRepository(Permissions).find({
                where: jwtData['permissions'].map(id => ({ id }))
            });

            if (permissions.length !== jwtData['permissions'].length) {
                return responseGenerator.sendError("One or more permissions not found");
            }

            // Get Tracks From Token
            const tracks = await Database.getRepository(Track).find({
                where: jwtData['tracks'].map(id => ({ id }))
            });

            if (tracks.length !== jwtData['tracks'].length) {
                return responseGenerator.sendError("One or more Tracks not found");
            }


            // Create New Admin Entity
            const newAdmin = new Admin()
            newAdmin.name = reqData['name']
            newAdmin.phone = reqData['phone']
            newAdmin.sex   = reqData['sex']
            newAdmin.permissions = permissions
            newAdmin.tracks      =  tracks

            // Save Admin to DB
            await Database.getRepository(Admin).save(newAdmin)


            // Create New LoginRouter Entity
            const newRouter = new LoginRouter()
            newRouter.admin = newAdmin
            newRouter.email = reqData['email']
            newRouter.password = null
            newRouter.username = reqData['username']
            newRouter.userType = true

            // Save Router to DB
            await Database.getRepository(LoginRouter).save(newRouter)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new AdminAuthednticationModel();
