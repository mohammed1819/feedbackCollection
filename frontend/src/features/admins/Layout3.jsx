import { Outlet } from "react-router-dom";
import Navbar3 from "./Navbar3";

const Layout3 = () => {
  return (
    <div>
        <Navbar3/>
        <Outlet/>
    </div>
  )
}

export default Layout3
