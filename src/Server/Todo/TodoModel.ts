import { Database } from "../../data-source";
import { TaskRecord } from "../../entity/TaskRecords";
import { Task } from "../../entity/Tasks";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class TodoModel{
    // Get The Tasks That Are Not Done
    async GetNotDoneTasks(reqData:object){
        const missing = checkUndefined(reqData,["userID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const TaskRecords = await Database
            .getRepository(TaskRecord)
            .createQueryBuilder("records")
            .innerJoinAndSelect("records.task","task")
            .innerJoinAndSelect("task.lecture","lecture")
            .innerJoinAndSelect("lecture.track","track")
            .where("records.done = false")
            .andWhere("records.student.id = :studentID",{studentID:reqData['userID']})
            .getMany()

            // Prettify the result into the desired format
            const transformedRecords = TaskRecords.map(record => ({
                id: record.id,
                title: record.task.title,
                done: record.done,
                lecture:{
                    title:record.task.lecture.title,
                    date:record.task.lecture.date
                }, 
                track : record.task.lecture.track.name
            }));

            return responseGenerator.sendData(transformedRecords)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Get The Tasks That Are Done
    async GetDoneTasks(reqData:object){
        const missing = checkUndefined(reqData,["userID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{

            const TaskRecords = await Database
            .getRepository(TaskRecord)
            .createQueryBuilder("records")
            .innerJoinAndSelect("records.task","task")
            .innerJoinAndSelect("task.lecture","lecture")
            .innerJoinAndSelect("lecture.track","track")
            .where("records.done = true")
            .andWhere("records.student.id = :studentID",{studentID:reqData['userID']})
            .getMany()

            // Prettify the result into the desired format
            const transformedRecords = TaskRecords.map(record => ({
                id: record.id,
                title: record.task.title,
                done: record.done,
                lecture:{
                    title:record.task.lecture.title,
                    date:record.task.lecture.date
                }, 
                track : record.task.lecture.track.name
            }));
            
            return responseGenerator.sendData(transformedRecords)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Mark Task as Done
    async MarkDone(reqData:object){
        const missing = checkUndefined(reqData,["recordID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const record = await Database.getRepository(TaskRecord).findOneBy({id:reqData['recordID']})
            if (!record){
                return responseGenerator.notFound
            }
            else if (record.done){
                return responseGenerator.sendError("التكليف تم بالفعل")
            }
            record.done = true
            await Database.getRepository(TaskRecord).save(record)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Mark Task as Not Done
    async MarkNotDone(reqData:object){
        const missing = checkUndefined(reqData,["recordID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const record = await Database.getRepository(TaskRecord).findOneBy({id:reqData['recordID']})
            if (!record){
                return responseGenerator.notFound
            }
            else if (!record.done){
                return responseGenerator.sendError("التكليف تم تعديله بالفعل")
            }
            record.done = false
            await Database.getRepository(TaskRecord).save(record)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
    
}

export default new TodoModel();
