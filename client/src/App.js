import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div>
      <h1>My App</h1>
    </div>
  );
}

export default App;