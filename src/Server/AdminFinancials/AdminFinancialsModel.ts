import { Database } from "../../data-source";
import { Attendance } from "../../entity/Attendance";
import { FinancialRecord } from "../../entity/FinancialRecord";
import { Lecture } from "../../entity/Lecture";
import { Student } from "../../entity/Student";
import { Track } from "../../entity/Track";
import { Wallet } from "../../entity/Wallet";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class AdminFinancialsModel{

    // Get All Financials Records
    async getAllFinancials(reqData:object){
        const missing = checkUndefined(reqData,["lectureID","trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Get all Student in the Lecture's Track
            const studentList = await Database.getRepository(Student).findBy({tracks:{id:reqData['trackID']}})
            
            const financialsSheet =[]
            for (var i =0;i< studentList.length;i++){
                const student= studentList[i]
                const status = await Database.getRepository(FinancialRecord).findOneBy({student:{id:student.id},lecture:{id:reqData['lectureID']}})
                const wallet = await Database.getRepository(Wallet).findOneBy({student:{id:student.id},track:{id:reqData['trackID']}})
                financialsSheet.push({
                    studentID:student.id,
                    studentName:student.name,
                    studentSex:student.sex,
                    paid: status ? status.paid : null
                })
                    // wallet: wallet ? wallet.value : 0
            }

            return responseGenerator.sendData(financialsSheet)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
    
    // Edit Track Expenses
    async EditTrackExpenses(reqData:object){
        const missing = checkUndefined(reqData,["trackID","newPrice"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Get The Track Info and Check if Not Exist
            const trackInfo = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            if(!trackInfo){
                return responseGenerator.notFound
            }

            //Edit the Price
            trackInfo.attendingExpensis = reqData['newPrice']

            // Save to DB
            await Database.getRepository(Track).save(trackInfo)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Submit New or Edited Financial Sheet
    async SubmitFinancialSheet(reqData:object){
        const missing = checkUndefined(reqData,["lectureID","trackID","people"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Check if People Parametger is object 
            if (typeof(reqData['people']) !== "object"){
                return responseGenerator.sendError("People Parameter Must Be a List of Students (Object)")
            }

            // Check if the Data Sent has All Track Students
            const studentsCount =  await Database.getRepository(Student).countBy({tracks:{id:reqData['trackID']}})
            if (studentsCount > reqData['people'].length){
                return responseGenerator.sendError("The Data Sent is Missing Some People")
            }

            // Get Lecture and Track Info
            const lectureInfo = await Database.getRepository(Lecture).findOneBy({id:reqData['lectureID']})
            const trackInfo = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            if (!lectureInfo || !trackInfo ){
                return responseGenerator.notFound
            }

            
            for(var i =0;i< reqData["people"].length;i++){
                var student = reqData["people"][i]
                // if the Record Exist, Modify it, otherwise, Create New Record
                var newAttendanceRecord = await Database.getRepository(FinancialRecord).findOneBy({lecture:{id:reqData['lectureID']},student:{id:student['studentID']}})
                if(!newAttendanceRecord){
                    newAttendanceRecord    = new FinancialRecord()
                }
                newAttendanceRecord.student  = await Database.getRepository(Student).findOneBy({id:student['studentID']})
                newAttendanceRecord.lecture  = lectureInfo
                newAttendanceRecord.track    = trackInfo
                newAttendanceRecord.paid     = student['paid']
                
                // Save to Database
                await Database.getRepository(FinancialRecord).save(newAttendanceRecord)

            }

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new AdminFinancialsModel();
