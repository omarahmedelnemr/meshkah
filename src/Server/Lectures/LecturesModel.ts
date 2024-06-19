import { Database } from "../../data-source";
import { Task } from "../../entity/Tasks";
import { Lecture } from "../../entity/Lecture";
import { Material } from "../../entity/Material";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";
import { TaskRecord } from "../../entity/TaskRecords";

class LecturesModel{
    // Get all Lectures List with track ID
    async getAllLectures(reqData:object){
        const missing = checkUndefined(reqData,["trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const lectures = await Database.getRepository(Lecture).findBy({track:{id:reqData['trackID']}})
            return responseGenerator.sendData(lectures)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Get a Lecture Materials
    async GetLectureMaterials(reqData:object){
        const missing = checkUndefined(reqData,["lectureID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const materials = await Database.getRepository(Material).findBy({lecture:{id:reqData['lectureID']}})
            return responseGenerator.sendData(materials)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Get a Lecture Tasks
    async GetLectureTasks(reqData:object){
        const missing = checkUndefined(reqData,["lectureID","userID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const TaskRecords = await Database
            .getRepository(TaskRecord)
            .createQueryBuilder("records")
            .innerJoinAndSelect("records.task","task")
            .where("task.lecture.id = :lectureID",{lectureID:reqData['lectureID']})
            .andWhere("records.student.id = :studentID",{studentID:reqData['userID']})
            .getMany()

            // Prettify the result into the desired format
            const transformedRecords = TaskRecords.map(record => ({
                id: record.id,
                title: record.task.title,
                done: record.done
            }));
            return responseGenerator.sendData(transformedRecords)

        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
}

export default new LecturesModel();
