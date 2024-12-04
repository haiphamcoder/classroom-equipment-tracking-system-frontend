import { BrowserRouter, Outlet, Router } from "react-router-dom";
import "./App.scss";
function App() {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
}

export default App;
