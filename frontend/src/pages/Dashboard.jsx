import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Upload from "./Upload";
import Chat from "./Chat";
import "./Dashboard.css";

function Dashboard({ isAdmin }) {
  const [currentPage, setCurrentPage] = useState("chat");

  const renderPage = () => {
    if (currentPage === "chat") return <Chat />;
    if (currentPage === "upload") return <Upload />;
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setCurrentPage={setCurrentPage} isAdmin={{ isAdmin }} />
      <div style={{ padding: "20px", flex: 1 }}>{renderPage()}</div>
    </div>
  );
}

export default Dashboard;
