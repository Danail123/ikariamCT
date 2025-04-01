import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid"; // or use your own generator

const supabase = createClient(
  "https://vbynizskqctrogrjshkb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZieW5penNrcWN0cm9ncmpzaGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzk1NTAsImV4cCI6MjA1ODkxNTU1MH0.JVjhK1VDC7w26vdLhn2nE2RKwVcXf6lqzPFU1ExUTDc"
);

export default function Home() {
  const [responseMsg, setResponseMsg] = useState("");
  const [table, setTable] = useState([]);
  const [formData, setFormData] = useState({
    server: "Pangaia 1",
    player: "",
    town: "",
    coordinates: "",
  });
  const [filterServer, setFilterServer] = useState("Pangaia 1");
  const [deleteKey, setDeleteKey] = useState("");

  useEffect(() => {
    getTable();
  }, []);

  const getTable = async () => {
    const { data } = await supabase.from("ikariamCulturalThreaty").select();
    setTable(data);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const deleteKey = nanoid(); // store this in localStorage or cookie

    const { data, error } = await supabase
      .from("ikariamCulturalThreaty")
      .insert([
        {
          server: formData.server,
          player: formData.player,
          town: formData.town,
          coordinates: formData.coordinates,
          delete_key: deleteKey,
        },
      ])
      .select();

    if (error) {
      console.error("Insert error:", error);
      setResponseMsg("Failed to save.");
      console.error("Insert error:", error.message); // Add this line
    }
    if (data && data.length > 0) {
      setResponseMsg(`✅ Saved player ${data[0].player}`);
      setDeleteKey(deleteKey);
    } else {
      setResponseMsg("✅ Saved, but no data returned.");
    }

    setFormData({ server: "Pangaia 1", player: "", town: "", coordinates: "" });
    getTable(); // refresh table immediately
  };

  const handleDelete = async (id) => {
    const deleteKey = prompt("Please enter delete code: ");
    const { error } = await supabase
      .from("ikariamCulturalThreaty")
      .delete()
      .match({ id: id, delete_key: deleteKey });

    if (error) {
      console.error("Delete error:", error.message);
      setResponseMsg("❌ Failed to delete.");
    } else {
      setResponseMsg("✅ Entry deleted.");
      getTable(); // Refresh table after deletion
    }
  };

  return (
    <>
      <div className="wrap">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="server">Server: </label>
            <select
              name="server"
              id="server"
              value={formData.server}
              onChange={handleChange}
            >
              <option value="Pangaia 1">Pangaia 1</option>
              <option value="Pangaia 2">Pangaia 2</option>
              <option value="Pangaia 3">Pangaia 3</option>
              <option value="Pangaia 4">Pangaia 4</option>
              <option value="Ares Global 1">Ares Global 1</option>
              <option value="Ares Global 2">Ares Global 2</option>
              <option value="Phobos Brazil">Phobos Brazil</option>
              <option value="Zelus Turkey">Zelus Turkey</option>
              <option value="Kronos Brazil">Kronos Brazil</option>
              <option value="Helios Brazil">Helios Brazil</option>
              <option value="Perseus UK">Perseus UK</option>
              <option value="Minotaurus Spain">Minotaurus Spain</option>
              <option value="Medusa Spain">Medusa Spain</option>
              <option value="Zelus Brazil">Zelus Brazil</option>
            </select>
            <label htmlFor="player">Player: </label>
            <input
              type="text"
              name="player"
              id="player"
              maxLength="30"
              value={formData.player}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="town">Town: </label>
            <input
              type="text"
              name="town"
              id="town"
              maxLength="30"
              value={formData.town}
              onChange={handleChange}
            />
            <label htmlFor="player">Coordinates: </label>
            <input
              type="text"
              name="coordinates"
              id="coordinates"
              maxLength="10"
              value={formData.coordinates}
              onChange={handleChange}
            />
            <button type="submit">Submit</button>
          </div>
        </form>
        <label id="filter-label" htmlFor="filter-server">
          Filter:
        </label>
        <select
          name="filter-server"
          id="filter-server"
          value={filterServer}
          onChange={(event) => setFilterServer(event.target.value)}
        >
          <option value="Pangaia 1">Pangaia 1</option>
          <option value="Pangaia 2">Pangaia 2</option>
          <option value="Pangaia 3">Pangaia 3</option>
          <option value="Pangaia 4">Pangaia 4</option>
          <option value="Ares Global 1">Ares Global 1</option>
          <option value="Ares Global 2">Ares Global 2</option>
          <option value="Phobos Brazil">Phobos Brazil</option>
          <option value="Zelus Turkey">Zelus Turkey</option>
          <option value="Kronos Brazil">Kronos Brazil</option>
          <option value="Helios Brazil">Helios Brazil</option>
          <option value="Perseus UK">Perseus UK</option>
          <option value="Minotaurus Spain">Minotaurus Spain</option>
          <option value="Medusa Spain">Medusa Spain</option>
          <option value="Zelus Brazil">Zelus Brazil</option>
        </select>
        <h3>
          {responseMsg && (
            <div
              style={{
                marginTop: "1rem",
                // background: "#eee",
                padding: "1rem",
              }}
            >
              <strong>{responseMsg}</strong>
              {deleteKey && (
                <>
                  <p>
                    Here is your delete code:
                    <code style={{ marginLeft: "0.5rem" }}>{deleteKey}</code>
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(deleteKey);
                      alert("Delete code copied to clipboard!");
                    }}
                  >
                    Copy Code
                  </button>
                </>
              )}
            </div>
          )}
        </h3>
        <div id="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Server</th>
                <th>Player</th>
                <th>Town</th>
                <th>Coordinates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {table
                .filter((row) => row.server === filterServer)
                .map((row) => (
                  <tr key={row.id}>
                    <td>{row.server}</td>
                    <td>{row.player}</td>
                    <td>{row.town}</td>
                    <td>{row.coordinates}</td>
                    <td>
                      <button onClick={() => handleDelete(row.id)}>X</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
