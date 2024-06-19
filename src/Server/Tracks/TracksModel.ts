import { Database } from "../../data-source";
import { Student } from "../../entity/Student";
import { Track } from "../../entity/Track";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";

class TracksModel {
    
    // Get All Tracks That The Student Enroll in
    async enrolled_tracks(reqData: object) {
        // Check for missing parameters
        const missing = checkUndefined(reqData, ["userID"]);
        if (missing) {
            return responseGenerator.sendMissingParam(missing);
        }

        try {
            // Fetch the student with enrolled tracks
            const student = await Database.getRepository(Student).findOne({
                where: { id: reqData['userID'] },
                relations: ['tracks'],
            });

            // Return the enrolled tracks
            return responseGenerator.sendData(student['tracks']);
        } catch (err) {
            // Log and handle errors
            console.log("There is an Error!!\n", err);
            return responseGenerator.Error;
        }
    }

    // Get All Tracks That The Student Can Enroll in
    async open_tracks(reqData: object) {
        // Check for missing parameters
        const missing = checkUndefined(reqData, ["userID"]);
        if (missing) {
            return responseGenerator.sendMissingParam(missing);
        }

        try {
            // Fetch the student with enrolled tracks
            const student = await Database.getRepository(Student).findOne({
                where: { id: reqData['userID'] },
                relations: ['tracks'],
            });

            // Extract the IDs of the enrolled tracks
            const enrolledTrackIds =Object(student.tracks).map(track => track.id) ;

            // Fetch tracks that are open for enrollment and not enrolled by the student
            const tracks = await Database.getRepository(Track).createQueryBuilder('track')
                .where('track.openForEnrollment = :openForEnrollment', { openForEnrollment: true })
                .andWhere('track.id NOT IN (:...enrolledTrackIds)', { enrolledTrackIds })
                .getMany();

            // Return the available tracks for enrollment
            return responseGenerator.sendData(tracks);
        } catch (err) {
            // Log and handle errors
            console.log("There is an Error!!\n", err);
            return responseGenerator.Error;
        }
    }
}

export default new TracksModel();
