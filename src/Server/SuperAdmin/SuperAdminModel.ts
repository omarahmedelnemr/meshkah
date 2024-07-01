import { Database } from "../../data-source";
import { Admin } from "../../entity/Admin";
import { LoginRouter } from "../../entity/LoginRouter";
import { Permissions } from "../../entity/Permissions";
import { Track } from "../../entity/Track";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

class SuperAdminModel{

    // Get All Admin List
    async getAdminsList(reqData:object){
        try{
            //  Get All Admins With thier Permissions
            const admins = await Database.getRepository(Admin).find({
                relations: ['permissions',"tracks"],
            });
            return responseGenerator.sendData(admins)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Generate a JWT to Add New Admin
    async CreateNewAdminLink(reqData:object){
        const missing = checkUndefined(reqData,["daysLimit","permissions","tracks"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Check Permissions Datatype
            if ( !Array.isArray(reqData['permissions']) || !Array.isArray(reqData['tracks'])){
                return responseGenerator.sendError("Permissions and tracks Parameter Must Be Array of Permissions ID's")
            }
            const JWTInfo = {
                target:"admin",
                permissions:reqData['permissions'],
                tracks:reqData['tracks']
            }
            //Generat JWT That Last For {daysLimit} Days
            var generatedJWT = jwt.sign( JWTInfo,process.env.JWTsecret,{ expiresIn: 60 * 60 * 24 * Number(reqData['daysLimit']) } )

            return responseGenerator.sendData(generatedJWT)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Change Admin Permission
    async ChangeAdminPermission(reqData: object) {
        const missing = checkUndefined(reqData, ["adminID", "permissions"]);
        if (missing) {
            return responseGenerator.sendMissingParam(missing);
        }

        try {
            // Check permissions Parameter Datatype
            if (!Array.isArray(reqData['permissions'])) {
                return responseGenerator.sendError("permissions Parameter Must Be a List of Permissions (Array)");
            }

            const adminID = reqData['adminID'];
            const permissionIDs = reqData['permissions'];

            // Fetch the Admin entity
            const adminRepository = Database.getRepository(Admin);
            const admin = await adminRepository.findOne({ where: { id: adminID }, relations: ["permissions"] });

            if (!admin) {
                return responseGenerator.sendError("Admin not found");
            }

            // Fetch the Permissions entities
            const permissionRepository = Database.getRepository(Permissions);
            const permissions = await permissionRepository.find({
                where: permissionIDs.map(id => ({ id }))
            });

            if (permissions.length !== permissionIDs.length) {
                return responseGenerator.sendError("One or more permissions not found");
            }

            // Update the admin's permissions
            admin.permissions = permissions;

            // Save the updated admin entity
            await adminRepository.save(admin);

            return responseGenerator.done;
        } catch (err) {
            console.log("There is an Error!!\n", err);
            return responseGenerator.sendError(err);
        }
    }

    // Remove Admin
    async RemoveAdmin(reqData:object){
        const missing = checkUndefined(reqData,["adminID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{   

            // Remove Admin Login Info
            await Database
            .getRepository(LoginRouter)
            .createQueryBuilder('login_router')
            .innerJoin("login_router.admin","admin")
            .delete()
            .from(LoginRouter)
            .where("admin.id = :adminID", { adminID: reqData['adminID'] })
            .execute()

            // Remove Admin Entity
            await Database
            .getRepository(Admin)
            .createQueryBuilder('admin')
            .delete()
            .from(Admin)
            .where("admin.id = :adminID", { adminID: reqData['adminID'] })
            .execute()

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Create New Track
    async AddNewTrack(reqData:object){
        const missing = checkUndefined(reqData,["name","lecturesCount","attendingExpensis","EnrollmentDeadline","lectureDay"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Create New Entry
            const newTrack              = new Track()
            newTrack.name               = reqData['name']
            newTrack.lecturesCount      = reqData['lecturesCount']
            newTrack.attendingExpensis  = reqData['attendingExpensis']
            newTrack.EnrollmentDeadline  = new Date(reqData['EnrollmentDeadline'])
            newTrack.lectureDay         = reqData['lectureDay']

            // Save to DB
            await Database.getRepository(Track).save(newTrack)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Assign Track To Admin
    async AssignTrack(reqData:object){
        const missing = checkUndefined(reqData,["trackID","adminID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Create New Entry
            const track = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            const admin = await Database.getRepository(Admin).findOne({ where: { id: reqData['adminID'] }, relations: ["tracks"] });

            if( !track || !admin){
                return responseGenerator.sendData("Track or Admin or Both are Not Found")
            }
            
            // Add The Track To Admins Tracks List
            admin.tracks.push(track)

            // Save to DB
            await Database.getRepository(Admin).save(admin)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Remove Assign Track From Admin
    async unAssignTrack(reqData:object){
        const missing = checkUndefined(reqData,["trackID","adminID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Create New Entry
            const track = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            const admin = await Database.getRepository(Admin).findOne({ where: { id: reqData['adminID'] }, relations: ["tracks"] });

            if( !track || !admin){
                return responseGenerator.sendData("Track or Admin or Both are Not Found")
            }
            
            // Remove the track from the admin's tracks list
            admin.tracks = admin.tracks.filter(existingTrack => existingTrack.id !== track.id);


            // Save to DB
            await Database.getRepository(Admin).save(admin)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Extend Track Close-Date
    async OpenTrackForEnrollment(reqData:object){
        const missing = checkUndefined(reqData,["trackID","DateToClose"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Create New Entry
            const newTrack              = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})

            // Change the Date
            newTrack.EnrollmentDeadline  = new Date(reqData['DateToClose'])

            // Save to DB
            await Database.getRepository(Track).save(newTrack)
            
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Close the Track (Modify Track Close Date to Now)
    async CloseTrackEnrollment(reqData:object){
        const missing = checkUndefined(reqData,["trackID","currentDate"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Create New Entry
            const newTrack              = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})

            // Change the Date
            newTrack.EnrollmentDeadline  = new Date(reqData['currentDate'])

            // Save to DB
            await Database.getRepository(Track).save(newTrack)
            
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Generate a Link For Track Registration
    async GenerateRegistrationLink(reqData:object){
        const missing = checkUndefined(reqData,["trackID","currentDate"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Getting Track Info
            const trackInfo = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            if(!trackInfo){
                return responseGenerator.sendError("Track Not Found")
            }
            
            const enrollmentDeadline = trackInfo.EnrollmentDeadline;
            if (!enrollmentDeadline) {
                return responseGenerator.sendError("Track EnrollmentDeadline date is not set");
            }

            const now = new Date(reqData['currentDate']);
            const enrollmentDate = new Date(enrollmentDeadline);
            const timeDifference = enrollmentDate.getTime() - now.getTime();

            if (timeDifference <= 0) {
                return responseGenerator.sendError("Track enrollment date has already passed");
            }

            const JWTInfo = {
                track:reqData['trackID'],
                target:"students"
            }
            //Generat JWT That Last For {daysLimit} Days
            const generatedJWT = jwt.sign(JWTInfo, process.env.JWTsecret, { expiresIn: timeDifference / 1000 });

            return responseGenerator.sendData(generatedJWT)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    async SuperLogin(reqData:object){
        const missing = checkUndefined(reqData,["username","password"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Parameters
            const username = reqData['username']
            const password = reqData['password']

            // Check Username Correctness
            if(username !== process.env.SUPERAMINDNAME){
                return responseGenerator.sendError("Username is Not Correct")
            }
            // Check Password Correctness
            else if(! await bcrypt.compare(password, process.env.SUPERAMINDPASS)){  
                return responseGenerator.wrongPassword
            }

            const JWTInfo = {
                "role" :"super-admin"
            }

            //Generat JWT That Last For 10 Days
            var genratedJWT = jwt.sign( JWTInfo,process.env.JWTsecret,{ expiresIn: 60 * 60 *24*10 } ) 

            const Data = {

                "jwt":genratedJWT,
                "userType":"super-admin"
            }
            return responseGenerator.sendData(Data)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

}

export default new SuperAdminModel();
