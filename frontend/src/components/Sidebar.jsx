import "./Sidebar.css";
import { useState } from "react";

function Sidebar({ setCurrentPage, isAdmin, isOpen, toggle, setShowProfile }) {
  const [activePage, setActivePage] = useState("chat");

  const handlePageChange = (page) => {
    setActivePage(page);
    setCurrentPage(page);
  };

  return (
    <div className={`sidebar ${isOpen ? "" : "closed"}`}>
      <div className={`header ${isOpen ? "" : "closed"}`}>
        {isOpen && <h2 className="gcc">GCC</h2>}

        <button className="menuBtn" onClick={toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#fffcdc"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <button
            className={`pages ${activePage === "chat" ? "active" : ""}`}
            onClick={() => handlePageChange("chat")}
          >
            Chat
            <svg
              xmlns="http://www.w3.org/2000/svg"
              /* width="24"
              height="24" */
              viewBox="0 0 24 24"
              /* fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round" */
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          {isAdmin && (
            <button
              className={`pages ${activePage === "upload" ? "active" : ""}`}
              onClick={() => handlePageChange("upload")}
            >
              Upload
              <svg
                xmlns="http://www.w3.org/2000/svg"
                /* width="24"
                height="24" */
                viewBox="0 0 24 24"
                /* fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" */
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
          )}

          <div className="profile">
            <button
              className={`pages ${activePage === "profile" ? "active" : ""}`}
              onClick={() => {
                setActivePage("profile");
                setShowProfile(true);
              }}
            >
              Profile
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                /* width="100"
                height="100"
                fill="none" */
              >
                <defs>
                  <linearGradient
                    id="avatarGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stop-color="#d3d2e9" />
                    <stop offset="100%" stop-color="#73ed3a" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="11" fill="url(#avatarGrad)" />

                <circle cx="12" cy="9.5" r="3.5" fill="#FFFFFF" />

                <path
                  d="M12 14c-3.3 0-6 2-6 5v.5c0 .3.2.5.5.5h11c.3 0 .5-.2.5-.5V19c0-3-2.7-5-6-5z"
                  fill="#FFFFFF"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
