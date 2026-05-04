function Sidebar({ setCurrentPage, isAdmin }) {
  return (
    <div style={{ width: "200px", background: "#eee", padding: "20px" }}>
      <h2>GCC</h2>

      <button onClick={() => setCurrentPage("chat")}>Chat</button>
      <br />
      <br />

      {isAdmin && (
        <>
          <button onClick={() => setCurrentPage("upload")}>
            Upload (Admin)
          </button>
          <br />
          <br />
        </>
      )}
    </div>
  );
}

export default Sidebar;
