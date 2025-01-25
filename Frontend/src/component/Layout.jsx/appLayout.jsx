import Header from "./header";
import { Outlet } from "react-router";



function AppLayout({ children }) {
  return (
    <>
      <Header />
      <Outlet />                {/* This is where the child components will be rendered */}
    </>
  );
}

export default AppLayout;