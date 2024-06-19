import { Database } from "../../data-source";
import { FinancialRecord } from "../../entity/FinancialRecord";
import { Track } from "../../entity/Track";
import { Wallet } from "../../entity/Wallet";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class OverviewModel{

    // Get Overview on Finanials
    async GetFinanials(reqData:object){
        const missing = checkUndefined(reqData,["userID","trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const recordsPaid= await Database.getRepository(FinancialRecord).countBy({student:{id:reqData['userID']},track:{id:reqData['trackID']},paid:true})
            const recordsLate= await Database.getRepository(FinancialRecord).countBy({student:{id:reqData['userID']},track:{id:reqData['trackID']},paid:false})
            const track = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            if (!track){
                return responseGenerator.notFound
            }
            
            const wallet = await Database.getRepository(Wallet).findOneBy({student:{id:reqData['studentID']},track:{id:reqData['trackID']}})
            

            const overview = {
                paid:   recordsPaid,
                late:   recordsLate,
                total:  track.lecturesCount,
                wallet: wallet ? wallet.value : 0
            }
            return responseGenerator.sendData(overview)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Get Overview on Assignments
    async GetAssignmentsOverview(reqData:object){
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

    // Get Overview on Statistics
    async GetStatisticsOverview(reqData:object){
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

    // Get The Next Lecture Date
    async GetNextLecture(reqData:object){
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

export default new OverviewModel();
