import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Standings() {
  const [table, setTable] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/standings/English_Premier_League')
      .then(response => setTable(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>League Standings</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.intPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}