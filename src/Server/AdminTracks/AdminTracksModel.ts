import { Database } from "../../data-source";
import { Admin } from "../../entity/Admin";
import { Track } from "../../entity/Track";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class AdminTracksModel{
    // Get all Track that is Assigned to the Admin By the Super-Admin:
    async assigned_tracks(reqData:object){
        const missing = checkUndefined(reqData,["adminID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const tracks = await Database.getRepository(Admin)
            .createQueryBuilder("admin")
            .innerJoinAndSelect("admin.tracks","tracks")
            .where("admin.id = :adminID",{adminID: reqData['adminID']})
            .getOne()

            if(!tracks){
                return responseGenerator.notFound
            }
            return responseGenerator.sendData(tracks['tracks'])

        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Change the Weekly Date of the Lecture if Somthing Happened
    async change_weekly_date(reqData:object){
        const missing = checkUndefined(reqData,["trackID","newDay","newTime"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const track = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            if(!track){
                return responseGenerator.notFound
            }

            // Change The Data
            track.lectureDay = reqData['newDay']
            track.lectureTime = reqData['newTime']

            // Save to Database
            await Database.getRepository(Track).save(track)
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new AdminTracksModel();
