import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Homepage from "./components/HomePage"
import Login from "./features/auth/Login"
import Signup from "./features/auth/Signup"
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
import Layout3 from "./features/admins/Layout3"
import AdminDashboard from "./features/admins/AdminDashboard"
import CompanyUsers from "./features/admins/CompanyUsers"
import Unauthorized from "./components/Unauthorized"
import CompanyFeedbacks from "./features/admins/CompanyFeedbacks"
import CompSingleFeed from "./features/admins/CompSingleFeed"
import AdminAnalytics from "./features/admins/AdminAnalytics"


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

        <Route element={<RequireAuth allowedRole="user" />}>
          <Route element={<Layout2 />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/myfeedbacks" element={<MyFeedbacks/>}/>
            <Route path="/myfeedbacks/:id" element={<SingleFeedback/>} />
            <Route path="/feedbackform" element={<FeedBackForm />} />
            <Route path="/myfeedbackstats" element={<FeedBackStats/>} />
          </Route>
        </Route>


        <Route element={<RequireAuth allowedRole="admin" />}>
          <Route element={<Layout3 />}>
          <Route path="/:slug/dashboard" element={<AdminDashboard/>} />
          <Route path="/:slug/companyusers" element={<CompanyUsers/>} />
          <Route path="/:slug/companyfeedbacks" element={<CompanyFeedbacks/>} />
          <Route path="/:slug/companyfeedbacks/:id" element={<CompSingleFeed/>} />
          <Route path="/:slug/analytics" element={<AdminAnalytics/>} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized/>}/>
      </Route>

    </Routes>
  )
}

export default App
