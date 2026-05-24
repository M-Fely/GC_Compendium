import "./Profile.css";
import { auth } from "../firebase";
import { logoutUser } from "../services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function Profile({ closeProfile }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("user");

      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <div className="profileOverlay" onClick={closeProfile}>
      <div className="profileCard" onClick={(e) => e.stopPropagation()}>
        <div className="profileHeader">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="avatar">{user?.displayName?.charAt(0) || "U"}</div>
          )}

          <div className="profileInfo">
            <h3>{user?.displayName || "Unknown User"}</h3>
            <p>{user?.email || "No email"}</p>
          </div>
        </div>

        <div className="profileMenu">
          <hr className="divider" />

          <button className="logoutBtn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

/* import "./Profile.css";
import { auth } from "../firebase";
import { logoutUser } from "../services/authService";

function Profile({ closeProfile }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await logoutUser();

      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <div className="profileOverlay" onClick={closeProfile}>
      <div className="profileCard" onClick={(e) => e.stopPropagation()}>
        <div className="profileHeader">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="avatar" />
          ) : (
            <div className="avatar">{user?.displayName?.charAt(0)}</div>
          )}

          <div className="profileInfo">
            <h3>{user?.displayName || "Unknown User"}</h3>
            <p>{user?.email || "No email"}</p>
          </div>
        </div>

        <div className="profileMenu"> */
{
  /*           <button className="menuItem">Settings</button>

          <button className="menuItem">Help & FAQ</button> */
}
{
  /* 
          <hr className="divider" />

          <button className="logoutBtn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile; */
}

/* import "./Profile.css";

function Profile({ closeProfile }) {
  return (
    <div className="profile-overlay" onClick={closeProfile}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <div className="avatar-large"></div>
          <div className="profile-info">
            <h3>Maurine Felismenia</h3>
            <p>maurien@example.com</p>
          </div>
        </div>

        <div className="profile-menu">
          <button className="menu-item">Settings</button>
          <button className="menu-item">Help & FAQ</button>
          <hr className="divider" />
          <button className="logout-btn">Log out</button>
        </div>
      </div>
    </div>
  );
}

export default Profile; */
