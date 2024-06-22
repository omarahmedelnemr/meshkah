import { Database } from "../../data-source";
import { Attendance } from "../../entity/Attendance";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class AttendanceModel{
    
    // Get All Attendance Records
    async getAllAttendance(reqData:object){
        const missing = checkUndefined(reqData,["userID","trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const attendanceRecords = await Database
            .getRepository(Attendance)
            .createQueryBuilder("Attendance")
            .innerJoinAndSelect("Attendance.lecture","lecture")
            .where("Attendance.student.id = :studentID",{studentID:reqData['userID']})
            .andWhere("Attendance.track.id = :trackID",{trackID:reqData['trackID']})
            .getMany()

            // Prettify the result into the desired format
            const transformedRecords = attendanceRecords.map(record => ({
                title: record.lecture.title,
                date: record.lecture.date,
                attended: record.attended,
            }));
            return responseGenerator.sendData(transformedRecords)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new AttendanceModel();
