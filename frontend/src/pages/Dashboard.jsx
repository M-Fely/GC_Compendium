/* import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Upload from "./Upload";
import Chat from "./Chat";
import Profile from "../components/Profile";
import "./Dashboard.css";

function Dashboard({ role }) {
  const [currentPage, setCurrentPage] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const renderPage = () => {
    if (currentPage === "chat") return <Chat />;
    if (currentPage === "upload") {
      if (role === "admin") {
        return <Upload />;
      } else {
        return <Chat />;
      }
    }
    return <Chat />;
  };

  return (
    <div className="dashboard">
      <Sidebar
        setCurrentPage={setCurrentPage}
        role={role}
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        setShowProfile={setShowProfile}
      />
      <div className="content">{renderPage()}</div>

      {showProfile && <Profile closeProfile={() => setShowProfile(false)} />}
    </div>
  );
}

export default Dashboard;
 */

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Upload from "./Upload";
import Chat from "./Chat";
import Profile from "../components/Profile";
import "./Dashboard.css";

function Dashboard({ isAdmin }) {
  const [currentPage, setCurrentPage] = useState("chat");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const renderPage = () => {
    if (currentPage === "chat") return <Chat />;

    if (currentPage === "upload") {
      if (isAdmin) {
        return <Upload />;
      } else {
        return <Chat />;
      }
    }

    return <Chat />;
  };

  return (
    <div className="dashboard">
      <Sidebar
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        setShowProfile={setShowProfile}
      />

      <div className="content">{renderPage()}</div>

      {showProfile && <Profile closeProfile={() => setShowProfile(false)} />}
    </div>
  );
}

export default Dashboard;
