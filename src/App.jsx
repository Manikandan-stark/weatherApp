import { useState } from "react";
import "./App.css";
import Weatherapp from "./components/Weatherapp";



function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Weatherapp />
    </>
  );
}

export default App;
