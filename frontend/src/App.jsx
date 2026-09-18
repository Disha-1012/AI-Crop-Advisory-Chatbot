import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import Navbar
  from "./components/Navbar";


import Dashboard
  from "./pages/Dashboard";


import Login
  from "./pages/Login";


import Register
  from "./pages/Register";


import Chat
  from "./pages/Chat";


import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        <Route
          path="/chat"
          element={<Chat />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;
