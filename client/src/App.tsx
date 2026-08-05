

import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./components/layouts/Layout.tsx";
import Home from "./features/home/Home.tsx";
import Account from "./features/account_page/Account.tsx";
import Register from "./features/account_page/Register.tsx";
import Login from "./features/account_page/Login.tsx";
import Stats from "./features/stats_page/Stats.tsx"
import Tasks from "./features/tasks_page/Tasks.tsx"
import AuthProvider from "./context/AuthProvider.tsx";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
          <Routes>
              <Route element={<Layout/>}>
                  <Route path="/" element={<Home/>}/>
                  <Route path="/account" element={<Account/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/stats" element={<Stats/>}/>
                  <Route path="/tasks" element={<Tasks/>}/>
              </Route>
          </Routes>

      </BrowserRouter>
    </AuthProvider>

  )
}

export default App