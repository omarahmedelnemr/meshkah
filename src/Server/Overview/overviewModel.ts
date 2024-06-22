import { Database } from "../../data-source";
import { Attendance } from "../../entity/Attendance";
import { FinancialRecord } from "../../entity/FinancialRecord";
import { TaskRecord } from "../../entity/TaskRecords";
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
        const missing = checkUndefined(reqData,["userID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const taskRecords = await Database
            .getRepository(TaskRecord)
            .createQueryBuilder("records")
            .innerJoinAndSelect("records.task", "task")
            .innerJoinAndSelect("task.lecture", "lecture")
            .innerJoinAndSelect("lecture.track", "track")
            .where("records.done = false")
            .andWhere("records.student.id = :studentID", { studentID: reqData['userID'] })
            .orderBy("lecture.date", "ASC") // Order by lecture date in ascending order
            .limit(5) // Limit to the oldest 5 records
            .getMany();

            // Prettify the result into the desired format
            const transformedRecords = taskRecords.map(record => ({
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

    // Get Overview on Statistics
    async GetStatisticsOverview(reqData:object){
        const missing = checkUndefined(reqData,["userID","trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            
            const paidPercentage = await  this.getPaymentsPercentage(reqData['userID'],reqData['trackID'])
            const donePercentage = await  this.getTasksPercentage(reqData['userID'],reqData['trackID'])
            const attendedPercentage = await  this.getAttendancePercentage(reqData['userID'],reqData['trackID'])

            const stats = {
                payment:paidPercentage,
                assignments:donePercentage,
                attendance:attendedPercentage
            }
            return responseGenerator.sendData(stats)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }

    // Get The Next Lecture Date
    async GetNextLecture(reqData:object){
        const missing = checkUndefined(reqData,["trackID"])
        if (missing){
            return responseGenerator.sendMissingParam(missing)
        }
        try{
            const nextLecDate = await this.findNextLectureDate(reqData['trackID']) 
            if(nextLecDate['status'] !== 200){
                return nextLecDate
            }
            const nextLecture = {
                nextLecture:nextLecDate['data']
            }
            return responseGenerator.sendData(nextLecture)
        }catch(err){
            console.log("There is an Error!!\n",err)
            return responseGenerator.Error
        }
    }


    // ------------------------------------------------------- //
    // ------------------- Sub Functions --------------------- //
    // ------------------------------------------------------- //

    // Get How many Payments are Paid to How Many are Not
    async getPaymentsPercentage(userID:number,trackID:number){
        const payments = await Database.getRepository(FinancialRecord)
            .createQueryBuilder("financialRecord")
            .select("SUM(CASE WHEN financialRecord.paid = true THEN 1 ELSE 0 END)", "paidCount")
            .addSelect("SUM(CASE WHEN financialRecord.paid = false THEN 1 ELSE 0 END)", "unpaidCount")
            .where("financialRecord.student.id = :userID", { userID })
            .andWhere("financialRecord.track.id = :trackID", { trackID })
            .getRawOne();
        const paidCount = parseInt(payments.paidCount, 10);
        const unpaidCount = parseInt(payments.unpaidCount, 10);
        const totalPaymentCount = paidCount + unpaidCount;
        const paidPercentage = totalPaymentCount > 0 ? (paidCount / totalPaymentCount) * 100 : 100;
        return paidPercentage
    }

    // Get How many Tasks are Done to How Many are Not
    async getTasksPercentage(userID,trackID){
        const tasks = await Database.getRepository(TaskRecord)
        .createQueryBuilder("taskRecord")
        .select("SUM(CASE WHEN taskRecord.done = true THEN 1 ELSE 0 END)", "doneCount")
        .addSelect("SUM(CASE WHEN taskRecord.done = false THEN 1 ELSE 0 END)", "notDoneCount")
        .innerJoin("taskRecord.task", "task")
        .innerJoin("task.lecture", "lecture")
        .innerJoin("lecture.track","track")
        .where("taskRecord.student.id = :userID", { userID })
        .andWhere("track.id = :trackID", { trackID })
        .getRawOne();

        const doneCount = parseInt(tasks.doneCount, 10);
        const notDoneCount = parseInt(tasks.notDoneCount, 10);
        const totaltasksCount = doneCount + notDoneCount;
        const donePercentage = totaltasksCount > 0 ? (doneCount / totaltasksCount) * 100 : 100;

        return donePercentage
    }

    // Get How many Lectures are Attended to How Many are Not
    async getAttendancePercentage(userID,trackID){
        const result = await Database.getRepository(Attendance)
            .createQueryBuilder("attendance")
            .select("SUM(CASE WHEN attendance.attended = 1 THEN 1 ELSE 0 END)", "attendedCount")
            .addSelect("SUM(CASE WHEN attendance.attended = 0 THEN 1 ELSE 0 END)", "notAttendedCount")
            .where("attendance.student.id = :userID", { userID })
            .andWhere("attendance.track.id = :trackID", { trackID })
            .getRawOne();

        const attendedCount = parseInt(result.attendedCount, 10);
        const notAttendedCount = parseInt(result.notAttendedCount, 10);
        const totalCount = attendedCount + notAttendedCount;
        const attendedPercentage = totalCount > 0 ? (attendedCount / totalCount) * 100 : 100;


        return attendedPercentage
    }


    // Helper function to calculate the next occurrence of a given day and time
    getNextLectureDate(dayOfWeek: string, timeOfDay: string): object {
        // Get the current date and time
        const now = new Date();

        // Convert dayOfWeek to an integer (0 for Sunday, 1 for Monday, etc.)
        const daysOfWeekMap: { [key: string]: number } = {
            "Sunday": 0,
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6,
        };

        const day = daysOfWeekMap[dayOfWeek];
        if (day === undefined) {
            return responseGenerator.sendError("Invalid day of the week");
        }

        // Convert timeOfDay to a 24-hour format (e.g., "4pm" to "16:00")
        const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])([APMapm]{2})$/;
        const match = timeOfDay.match(timeRegex);
        if (!match) {
            return responseGenerator.sendError("Invalid time format");
        }

        let hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        const period = match[3].toUpperCase();

        if (period === "PM" && hour !== 12) {
            hour += 12;
        } else if (period === "AM" && hour === 12) {
            hour = 0;
        }

        // Create the next lecture date starting from today
        const nextLectureDate = new Date(now);
        nextLectureDate.setHours(hour, minute, 0, 0);

        // Adjust the day of the week
        const currentDay = now.getDay();
        let dayDifference = day - currentDay;

        // If the day of the week is the same, check if the time has already passed today
        if (dayDifference === 0 && nextLectureDate <= now) {
            dayDifference = 7; // Next week
        } else if (dayDifference < 0 || (dayDifference === 0 && nextLectureDate <= now)) {
            dayDifference += 7; // Calculate for the next week
        }

        nextLectureDate.setDate(now.getDate() + dayDifference);

        return responseGenerator.sendData(nextLectureDate);
    }

    // Example usage of the function to find the next lecture date
    async  findNextLectureDate(trackID: number): Promise<object> {
        const track = await Database.getRepository(Track).findOne({ where: { id: trackID } });

        if (!track) {
            return responseGenerator.sendError("Lecture not found");
        }

        if (!track.lectureDay || !track.lectureTime) {
            return responseGenerator.sendError("Lecture dayOfWeek or timeOfDay is not set");
        }

        return this.getNextLectureDate(track.lectureDay, track.lectureTime);
    }
}

export default new OverviewModel();
