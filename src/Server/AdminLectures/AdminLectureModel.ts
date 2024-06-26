import { Database } from "../../data-source";
import { Lecture } from "../../entity/Lecture";
import { Material } from "../../entity/Material";
import { Student } from "../../entity/Student";
import { TaskRecord } from "../../entity/TaskRecords";
import { Task } from "../../entity/Tasks";
import { Track } from "../../entity/Track";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class AuthenticationModel{
    // Get All Lectures Related to a Track 
    async getAllLectures(reqData:object){
        const missing = checkUndefined(reqData,["trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const lectures = await Database.getRepository(Lecture).findBy({track:{id:reqData['trackID']},archived:false})
            return responseGenerator.sendData(lectures)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // get a Tasks Related to a Given Lecture
    async getAllLectureTasks(reqData:object){
        const missing = checkUndefined(reqData,["lectureID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{

            const tasks = await Database.getRepository(Task).findBy({lecture:{id:reqData['lectureID']}})

            return responseGenerator.sendData(tasks)

        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // get a Materials Related to a Given Lecture
    async getAllLectureMaterials(reqData:object){
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

    // Add New Lecture to a Track
    async addNewLecture(reqData:object){
        const missing = checkUndefined(reqData,["trackID","lectureDate"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            var trackLecturTitle = reqData["lectureTitle"]
            if (!trackLecturTitle){

                // the count of track Lectures
                var LecturesCount = await Database.getRepository(Lecture).countBy({track:{id:reqData["trackID"]},archived:false})
                trackLecturTitle = "المحاضرة "+ (Number(LecturesCount)+1)
            }

            // Create New Lecture
            const newLecture = new Lecture()
            newLecture.title = trackLecturTitle 
            newLecture.date = new Date(reqData['lectureDate']) 
            newLecture.track = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            await Database.getRepository(Lecture).save(newLecture)
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Edit the Lecture Data Like Name, Date
    async EditLectureData(reqData){
        const missing = checkUndefined(reqData,["lectureID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{

            // Create New Lecture
            const lectureData = await Database.getRepository(Lecture).findOneBy({id:reqData['lectureID']})
            if(reqData['lectureTitle']){
                lectureData.title = reqData['lectureTitle'] 
            }
            if (reqData['lectureDate']){
                lectureData.date = new Date(reqData['lectureDate']) 
            }

            // Save to Database
            await Database.getRepository(Lecture).save(lectureData)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Add New Task to a Lecture
    async addNewTask(reqData:object){
        const missing = checkUndefined(reqData,["lectureID","taskText"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{    
            // Creating New Entity
            const newTask   = new Task()
            newTask.title   = reqData['taskText']
            newTask.lecture = reqData['lectureID'] 
            await Database.getRepository(Task).save(newTask)

            // Get Student List who are Registerd in the Track 
            const TrackInfo = await Database.getRepository(Lecture)
                .createQueryBuilder("lecture")
                .innerJoinAndSelect("lecture.track","track")
                .where("lecture.id = :lectureID",{lectureID:reqData['lectureID']})
                .getOne()
            if ( !TrackInfo || !TrackInfo['track'] || !TrackInfo['track']['id']){
                return responseGenerator.notFound
            }
            const studentsList = await Database.getRepository(Student)
                                        .createQueryBuilder("student")
                                        .innerJoin("student.tracks","tracks")
                                        .where("tracks.id =:trackID",{trackID:TrackInfo['track']['id']})
                                        .getMany()

            // Assign Task to Each Student
            for (var student of studentsList){
                const newRecord = new TaskRecord()
                newRecord.student = student
                newRecord.task = newTask
                await Database.getRepository(TaskRecord).save(newRecord)
            }
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Add New Material to a Lecture
    async addNewMaterial(reqData:object){
        const missing = checkUndefined(reqData,["lectureID","materialTitle","materialLink","materialVideo"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const newMaterial = new Material()
            newMaterial.title = reqData['materialTitle']
            newMaterial.link = reqData['materialLink']
            newMaterial.video = reqData['materialVideo']
            newMaterial.lecture = await Database.getRepository(Lecture).findOneBy({id:reqData['lectureID']})
            
            await Database.getRepository(Material).save(newMaterial)
            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Remove a Lecture
    async ArchiveLecture(reqData:object){
        const missing = checkUndefined(reqData,["lectureID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Remove Task Assingment from all Student
            const tasks = await Database.getRepository(Task).findBy({lecture:{id:reqData['lectureID']}})
            for (var task of tasks){
                await Database
                    .getRepository(TaskRecord)
                    .createQueryBuilder('record')
                    .innerJoin("record.task","task")
                    .delete()
                    .from(TaskRecord)
                    .where("task.id = :taskID", { taskID: task.id })
                    .execute()
            }
            // Remove all Tasks Related to The Lecture
            await Database
                .getRepository(Task)
                .createQueryBuilder('task')
                .innerJoin("task.lecture","lecture")
                .delete()
                .from(Task)
                .where("lecture.id = :lectureID", { lectureID: reqData['lectureID'] })
                .execute()

            // Remove all Materials Related to The Lecture
            await Database
            .getRepository(Material)
            .createQueryBuilder('Material')
            .innerJoin("Material.lecture","lecture")
            .delete()
            .from(Material)
            .where("lecture.id = :lectureID", { lectureID: reqData['lectureID'] })
            .execute()
        
            // Archive The Lecture itself
            const lecture = await Database.getRepository(Lecture).findOneBy({id:reqData['lectureID']})
            lecture.archived = true
            await Database.getRepository(Lecture).save(lecture)

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Remove Material
    async RemoveTask(reqData:object){
        const missing = checkUndefined(reqData,["taskID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{ 
            // Remove Task Assingment from all Student
            await Database
            .getRepository(TaskRecord)
            .createQueryBuilder('record')
            .innerJoin("record.task","task")
            .delete()
            .from(TaskRecord)
            .where("task.id = :taskID", { taskID: reqData['taskID'] })
            .execute()

            // Remove Task 
            await Database
            .getRepository(Task)
            .createQueryBuilder('task')
            .delete()
            .from(Task)
            .where("task.id = :taskID", { taskID: reqData['taskID'] })
            .execute()

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Remove a Material
    async RemoveMaterial(reqData:object){
        const missing = checkUndefined(reqData,["materialID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            // Remove Material
            await Database
            .getRepository(Material)
            .createQueryBuilder('material')
            .delete()
            .from(Material)
            .where("material.id = :materialID", { materialID: reqData['materialID'] })
            .execute()

            return responseGenerator.done
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }
    
}

export default new AuthenticationModel();
