import AuthenticationRoutes       from './Server/Routes/Authentication'
import OverviewRoutes             from './Server/Routes/Overview'
import TracksRoutes               from './Server/Routes/Tracks'
import LecturesRoutes             from './Server/Routes/Lectures'
import AttendanceRoutes           from './Server/Routes/Attendance'
import TodoRoutes                 from './Server/Routes/Todo'
import SettingsRoutes             from './Server/Routes/Settings'
import AdminAuthenticationRoutes  from './Server/Routes/AdminAuthentication'
import AdminTracksRoutes          from './Server/Routes/AdminTracks'
import AdminLectureRoutes         from './Server/Routes/AdminLecture'
import AdminAttendanceRoutes      from './Server/Routes/AdminAttendance'
import AdminFinancialsRoutes      from './Server/Routes/AdminFinancials'
import SuperAdminRoutes           from './Server/Routes/SuperAdmin'

var cors = require('cors')
const express = require('express');
const app = express()
const cookieParser = require('cookie-parser');

// Use of Middlewares
app.set('Access-Control-Allow-Origin', '*');

app.use(cors({
    origin:true,
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

//// Routes Collection

//------------ User Routes ------------//

// User Authentication Routes
app.use("/auth",AuthenticationRoutes)

// Overview Routes
app.use("/overview",OverviewRoutes)

// User Tracks Routes
app.use("/tracks",TracksRoutes)

// User Lectures Routes
app.use("/lectures",LecturesRoutes)

// User Attendance Routes
app.use("/attendance",AttendanceRoutes)

// Overview Routes
app.use("/overview",OverviewRoutes)

// User Todo Routes
app.use("/todo",TodoRoutes)

// User Settings Routes
app.use("/settings",SettingsRoutes)

//------------ Admin Routes ------------//

// Admin Authentication Routes
app.use("/admin",AdminAuthenticationRoutes)

// Admin Tracks Routes
app.use("/admin-tracks",AdminTracksRoutes)

// Admin Lectures Routes
app.use("/admin-lectures",AdminLectureRoutes)

// Admin Attendance Routes
app.use("/admin-attendance",AdminAttendanceRoutes)

// Admin Financials Routes
app.use("/admin-financials",AdminFinancialsRoutes)

//------------ Super Admin Routes ------------//

// Super Admin Routes
app.use("/super-admin",SuperAdminRoutes)

// Main API Route
app.get('/',async (req,res)=>{
    res.send("\
        <div style='display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%;background-color:#dfdfdf'>\
            <h1 >Congrats, Meshkah API is Working :D</h1>\
            <h2><a href='https://docs.mishkah.omarelnemr.xyz' target='_blank'>Go To Docs Page ...  متنساش تجدد النية</a></h2>\
        </div>")
})


export default app