import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://vbynizskqctrogrjshkb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZieW5penNrcWN0cm9ncmpzaGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzk1NTAsImV4cCI6MjA1ODkxNTU1MH0.JVjhK1VDC7w26vdLhn2nE2RKwVcXf6lqzPFU1ExUTDc"
);

export default function Home() {
  const [responseMsg, setResponseMsg] = useState("");
  const [table, setTable] = useState([]);
  const [formData, setFormData] = useState({
    player: "",
    town: "",
    coordinates: "",
  });

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

    const { data, error } = await supabase
      .from("ikariamCulturalThreaty")
      .insert([
        {
          player: formData.player,
          town: formData.town,
          coordinates: formData.coordinates,
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
    } else {
      setResponseMsg("✅ Saved, but no data returned.");
    }

    setFormData({ player: "", town: "", coordinates: "" });
    getTable(); // refresh table immediately
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("ikariamCulturalThreaty")
      .delete()
      .eq("id", id);

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
          <label htmlFor="player">Player: </label>
          <input
            type="text"
            name="player"
            id="player"
            value={formData.player}
            onChange={handleChange}
          />
          <label htmlFor="town">Town: </label>
          <input
            type="text"
            name="town"
            id="town"
            value={formData.town}
            onChange={handleChange}
          />
          <label htmlFor="player">Coordinates: </label>
          <input
            type="text"
            name="coordinates"
            id="coordinates"
            value={formData.coordinates}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Town</th>
              <th>Coordinates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.id}>
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
        <h1>{responseMsg}</h1>
      </div>
    </>
  );
}
