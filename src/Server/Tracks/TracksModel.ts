import { Database } from "../../data-source";
import { Student } from "../../entity/Student";
import { Track } from "../../entity/Track";
import checkUndefined from "../../middleware/checkUndefined";
import responseGenerator from "../../middleware/responseGenerator";
var jwt = require('jsonwebtoken');

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

    // Get a Single Track INfo
    async TrackInfo(reqData: object) {
        // Check for missing parameters
        const missing = checkUndefined(reqData, ["trackID","tokwn"]);
        if (missing) {
            return responseGenerator.sendMissingParam(missing);
        }
        try {
            try{
                // Verify the Access to People Who Has a Right Token
                await jwt.verify(reqData["token"],process.env.JWTsecret)
                
            }catch(err){
                return responseGenerator.sendError("The Token is Invalid")
            }
            


            // Get The Track Info
            const trackInfo = await Database.getRepository(Track).findOneBy({id:reqData['trackID']})
            
            // Return the track Info
            return responseGenerator.sendData(trackInfo);
        } catch (err) {
            // Log and handle errors
            console.log("There is an Error!!\n", err);
            return responseGenerator.Error;
        }
    }

    // Register in a Selected Track
async RegisterInTrack(reqData: object) {
    // Check for missing parameters
    const missing = checkUndefined(reqData, ["trackID", "studentID"]);
    if (missing) {
        return responseGenerator.sendMissingParam(missing);
    }

    try {
        // Get The Student Info
        const studentRepository = Database.getRepository(Student);
        const student = await studentRepository.findOne({
            where: { id: reqData['studentID'] },
            relations: ["tracks"]  // Ensure that tracks relation is loaded
        });

        if (!student) {
            return responseGenerator.sendError("Student not found");
        }

        // Get The Track Info
        const trackRepository = Database.getRepository(Track);
        const track = await trackRepository.findOneBy({ id: reqData['trackID'] });

        if (!track) {
            return responseGenerator.sendError("Track not found");
        }

        // Add the track to the student's list of tracks
        Object(student.tracks).push(track);

        // Save the updated student entity
        await studentRepository.save(student);

        // Return the updated student info
        return responseGenerator.done;
    } catch (err) {
        // Log and handle errors
        console.log("There is an Error!!\n", err);
        return responseGenerator.Error;
    }
}

    
}

export default new TracksModel();
