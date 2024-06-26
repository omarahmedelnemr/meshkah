import { Database } from "../../data-source";
import { Attendance } from "../../entity/Attendance";
import { Lecture } from "../../entity/Lecture";
import { Student } from "../../entity/Student";
import { Track } from "../../entity/Track";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class AdminAttendanceModel{

    // Get All Attendance Records
    async getAllAttendance(reqData:object){
        const missing = checkUndefined(reqData,["lectureID","trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Get all Student in the Lecture's Track
            const studentList = await Database.getRepository(Student).findBy({tracks:{id:reqData['trackID']}})
            
            const attendanceSheet =[]
            for (var i =0;i< studentList.length;i++){
                const student= studentList[i]
                const status = await Database.getRepository(Attendance).findOneBy({student:{id:student.id},lecture:{id:reqData['lectureID']}})
                attendanceSheet.push({
                    studentID:student.id,
                    studentName:student.name,
                    studentSex:student.sex,
                    status: status? status.attended:null
                })
            }

            return responseGenerator.sendData(attendanceSheet)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Submit New or Edited Attendance Sheet
    async SubmitAttendanceSheet(reqData:object){
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
                var newAttendanceRecord = await Database.getRepository(Attendance).findOneBy({lecture:{id:reqData['lectureID']},student:{id:student['studentID']}})
                if(!newAttendanceRecord){
                    newAttendanceRecord    = new Attendance()
                }
                newAttendanceRecord.student  = await Database.getRepository(Student).findOneBy({id:student['studentID']})
                newAttendanceRecord.lecture  = lectureInfo
                newAttendanceRecord.attended = student['status']
                newAttendanceRecord.track    = trackInfo
                
                // Save to Database
                await Database.getRepository(Attendance).save(newAttendanceRecord)

            }

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new AdminAttendanceModel();
