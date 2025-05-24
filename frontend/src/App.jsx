import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Homepage from "./components/HomePage"
import Login from "./features/auth/Login"
import Signup from "./features/auth/Signup"
import Test from "./features/feedback/Test"
import Dashboard from "./features/feedback/Dashboard"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import About from "./components/About"
import Contacts from "./components/Contacts"
import Layout2 from "./features/feedback/Layout2"
import AnonymousFeedback from "./components/AnonymousFeedback"
import FeedBackForm from "./features/feedback/FeedBackForm"
import MyFeedbacks from "./features/feedback/MyFeedbacks"
import SingleFeedback from "./features/feedback/SingleFeedback"
import FeedBackStats from "./features/feedback/FeedBackStats"
import RegisterCompany from "./features/company/RegisterCompany"
import ConfirmationPage from "./features/company/ConfirmationPage"


function App() {

  return (
    <Routes>


      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="about" element={<About />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="anonymousfeed" element={<AnonymousFeedback />} />
        <Route path="company-register" element={<RegisterCompany/>} />
        <Route path="verify" element={<ConfirmationPage/>}/>
      </Route>


      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route element={<Layout2 />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/test" element={<Test />} />
            <Route path="/myfeedbacks" element={<MyFeedbacks/>}/>
            <Route path="/myfeedbacks/:id" element={<SingleFeedback/>} />
            <Route path="/feedbackform" element={<FeedBackForm />} />
            <Route path="/myfeedbackstats" element={<FeedBackStats/>} />
          </Route>
        </Route>
      </Route>

    </Routes>
  )
}

export default App
