const express = require("express")
const app = express()
const FirstPageInfo = require('./models/firstpageinfo')
const UserInfo = require("./models/userinfo")
const MainInfo = require("./models/maininfo")
const UserCreditScore = require("./models/usercreditscores")
const Otp = require("./models/optdb")
const methodOverride = require("method-override")
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const {exec} = require('child_process')
const sendEmail = require("./email/email")
const bcrypt = require("bcrypt")


const PORT = process.env.PORT

app.listen(PORT, () => console.log("Server is listening."))

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
}

const isProduction = process.env.NODE_ENV === 'production'
const uploadDirectory = isProduction ? 'uploads' : path.join(__dirname, 'uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors(corsOptions))

app.post("/", async (req, res) => {
    let {username, gender,fullName,email,mobNo} = req.body
    try {
        let firstpageinfo = await FirstPageInfo.create({
            username: username,
            gender: gender,
            fullName: fullName,
            email: email,
            mobNo: mobNo
        })
        res.status(200).send(firstpageinfo) 
    } 
    catch (error) {
        res.status(500).send({ message: "Internal server error"})
    }
})

app.post("/signup", async (req, res) => {
    let {username, email, password} = req.body
    try {
        let isUser = await UserInfo.findOne({ $or: [{ username: username }, { email: email }] })
        if(isUser){
            if (isUser.email === email){
                return res.status(408).send({ message: "Email already in use"})
            }
            if (isUser.username === username){
                return res.status(409).send({ message: "Username already exists"})
            }
        }
        let otpsent = Math.floor(100000 + Math.random() * 900000)
        let sendingEmail = await sendEmail(email, otpsent)
        let hashedPassword = await bcrypt.hash(password, 10)
        await Otp.findOneAndUpdate({email: email}, {username: username, email: email, password: hashedPassword, otp: otpsent}, { upsert: true, new: true })
        return res.status(200).send({username, email}) 
    } 
    catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal server error"})
    } 
})

app.post("/signup/otp", async (req, res) => {
    let { email, enteredotp } = req.body
    try {
        let otpdata = await Otp.findOne({email: email})
        if( otpdata.otp === parseInt(enteredotp) ) {
            await UserInfo.create({
                username: otpdata.username,
                email: otpdata.email,
                password: otpdata.password,
            })
            await Otp.deleteOne({ email })
            res.status(200).send("Signup successful")
        }
        else {
            res.status(403).send("Incorrect OTP")
        }
    }
    catch (error) {
        res.send("Internal server error")
    }
})

app.post("/signup/resend-otp", async (req, res) => {
    let { email } = req.body;
    try {
        let otpData = await Otp.findOne({ email: email })
        if (!otpData) {
            return res.status(404).send({ message: "No OTP request found for this email. Please sign up again." })
        }
        let otpsent = Math.floor(100000 + Math.random() * 900000)
        let sendingEmail = await sendEmail(email, otpsent)
        await Otp.findOneAndUpdate(
            { email: email },
            { otp: otpsent, createdAt: new Date() },
            { new: true }
        )
        res.status(200).send({ message: "New OTP sent successfully" })
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" })
    }
})

app.post("/signin", async (req, res) => {
    let {email,password} = req.body
    try {
        let isUser = await UserInfo.findOne({email})
        if(!isUser) {
            return res.status(404).send({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, isUser.password);
        if (!isPasswordValid) {
            return res.status(403).send({ message: "Password is incorrect" });
        }
        return res.status(200).send(isUser)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error"})
    }
})

app.post("/signin/forgotpassword", async (req, res) => {
    let {email} = req.body
    try {
        let otpsent = Math.floor(100000 + Math.random() * 900000)
        let sendingEmail = await sendEmail(email, otpsent)
        await Otp.findOneAndUpdate({email: email}, {email: email, otp: otpsent}, { upsert: true, new: true })
        res.status(200).send("Email sent")
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error"})
    }
})

app.post("/signin/forgotpassword/verify", async (req, res) => {
    let {email, enteredotp} = req.body
    try {
        let otpdata = await Otp.findOne({email: email})
        if( otpdata.otp === parseInt(enteredotp) ) {
            await Otp.deleteOne({ email })
            res.status(200).send("Otp verified")
        }
        else {
            res.status(403).send("Incorrect OTP")
        }
    }
    catch (error) {
        res.send("Internal server error")
    }
})

app.post("/signin/updatepassword", async (req, res) => {
    const newPassword = req.body.newPassword
    const email = req.body.email
    try {
        let userData = await UserInfo.findOne({email: email})
        if( userData ) {
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await UserInfo.findOneAndUpdate({email: email}, { $set: { password: hashedPassword } }, { new: true })
            res.status(200).send("Password updated successfully")
        }
        else {
            res.status(403).send("User not found")
        }
    }
    catch (error) {
        res.send("Internal server error")
    }
})

app.post("/:username/getscore", upload.fields([{ name: "aadhaar" }, { name: "loan" }, { name: "insurance" },]), async (req, res) => {
    let { username } = req.params
    let {income, qualification, dependents, assets, debt, city} = req.body
    let files = req.files
    try {
        let mainData = await MainInfo.create({
        username: username,
        income: income,
        qualification: qualification,
        aadhaar: files.aadhaar[0].path,
        dependents: dependents,
        loan: files.loan[0].path,
        insurance: files.insurance[0].path,
        assets: assets,
        debt: debt,
        city: city
        })
        res.status(200).send(mainData)
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error"})
    }
})

app.post("/:username/showscore/:id", async(req, res) => {
    let {username, id} = req.params
    exec(`python ../logic/main.py "${username}" ${id}`, async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          return res.status(500).send({ message: "Error executing Python script" })
        }
        console.log(`stdout: ${stdout}`)
        try {
            const savedData = await UserCreditScore.findOne({ username: username, id: id })
            if (savedData) {
                res.status(200).send(savedData)
            } else {
                res.status(404).send({ message: "No credit score data found" })
            }
        } catch (err) {
            console.error("Error fetching data:", err)
            res.status(500).send({ message: "Error fetching credit score data" })
        }
    })
})

app.get("/:username/history", async (req, res) => {
    let {username} = req.params
    try {
        let allcreditscores = await UserCreditScore.find({username: username})
        if (allcreditscores){
            res.status(200).send({allcreditscores})
        }
        else
            res.status(404).send({ message : "No credit score history found for the user." })
    }
    catch (error) {
        res.status(500).send({ message : "Internal server error. Please try again later." })
    }
})

app.get("/:username/profile", async (req, res) => {
    let {username} = req.params
    try {
        let profileData = await UserInfo.findOne({username: username})
        if (profileData){
            res.status(200).send(profileData)
        }
        else
            res.status(404).send({ message : "No data found." })
    }
    catch (error) {
        console.error("Error:", error)
        res.status(500).send({ message : "Internal server error. Please try again later." })
    }
})

app.post("/:username/profile/updatepassword", async (req, res) => {
    let {username} = req.params
    let oldpassword = req.body.oldPassword
    let newpassword = req.body.newPassword
    try {
        let userData = await UserInfo.findOne({username: username})
        if (!userData) {
            return res.status(404).send({ message: "User not found." });
        }
        const isPasswordValid = await bcrypt.compare(oldpassword, userData.password);
        if (!isPasswordValid) {
            return res.status(403).send({ message: "Old password is incorrect." });
        }
        const hashedNewPassword = await bcrypt.hash(newpassword, 10)
        let updateUserData = await UserInfo.findOneAndUpdate({username: username}, {password: hashedNewPassword}, { new: true })
        res.status(200).send({ message: "Password updated successfully." })

    }
    catch (error) {
        console.error("Error:", error)
        res.status(500).send({ message : "Internal server error. Please try again later." })
    }
})

app.get("*", (req, res) => {
    console.log("404 route hit for path:", req.originalUrl)
    res.status(404).send("<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>")
})
