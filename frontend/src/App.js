import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './home/home'
import SignUp from './signup/signup'
import CreditScore from './getcreditscore/score'
import Signin from './signin/signin'
import ShowScore from './showscore/showscore'
import Profile from './profile/profile'
import Help from './help/help'
import About from './about/about'
import History from './history/history'
import UpdatePassword from './updateprofilepassword/updatepassword'
import Otp from './signupotp/otp'
import ForgotPassword from './forgotpassword/forgotpassword'
import VerifyOtp from './verifyotp/verifyotp'
import ChangePassword from './updatesigninpassword/changepassword'
import ForgotProfilePassword from './forgotprofilepassword/forgotprofilepassword'
import VerifyProfileOtp from './verifyprofileotp/verifyprofileotp'
import ChangeProfilePassword from './changeprofilepassword/changeprofilepassword'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/otp" element={<Otp />} />
        <Route path="/:username/getscore" element={<CreditScore />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/:username/showscore/:id" element={<ShowScore />} />
        <Route path="/:username/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/:username/history" element={<History />} />
        <Route path="/:username/profile/updatepassword" element={<UpdatePassword />} />
        <Route path="/signin/forgotpassword" element={<ForgotPassword />} />
        <Route path="/signin/forgotpassword/verify" element={<VerifyOtp />} />
        <Route path="/signin/updatepassword" element={<ChangePassword />} />
        <Route path="/:username/profile/forgotpassword" element={<ForgotProfilePassword />} />
        <Route path="/:username/profile/forgotpassword/verify" element={<VerifyProfileOtp/>} />
        <Route path="/:username/profile/changepassword" element={<ChangeProfilePassword/>} />
      </Routes>
    </Router>
  )
}

export default App;
