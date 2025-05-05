import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Visitor = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/visitor")
      .then((res) => setCount(res.data.visitorCount))
      .catch((err) => console.error("Visitor error:", err));
  }, []);

  return (
    <div >
      {count !== null ? `Visitors: ${count}` : "Loading visitor count..."}
    </div>
  );
};

export default Visitor;
