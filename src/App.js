import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./presentation/login";
import Signup from "./presentation/register";
import Dashboard from "./presentation/dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="about" render={() => <Redirect to="about-us" />} /> */}
          {/* <Navigate to="/login" replace  /> */}
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route element={<Login />} path="/login" />
          <Route exact={true} element={<Signup />} path="/signup" />
          <Route exact={true} element={<Dashboard />} path="/dashboard" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
