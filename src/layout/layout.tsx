import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Login } from "../components/auth/login";
import { Register } from "../components/auth/register";
import { Home } from "../components/home";
import { NotFound } from "../components/not-found";
import { Dashboard } from "../components/dashboard/dashboard";
import './css/layout.css';
import { Header } from "./header";

export function Layout() {
  const [user, setUser] = useState(() => {
    const uuidSaved = localStorage.getItem("uuid");
    const nameSaved = localStorage.getItem("name");
    const typeSaved = localStorage.getItem("type");
    if (uuidSaved && nameSaved && typeSaved) {
      return {
        uuid: JSON.parse(uuidSaved),
        name: JSON.parse(nameSaved),
        type: JSON.parse(typeSaved),
      }
    } else return {uuid: '', name: '', type: ''}
  });

  const onSignIn = (data: any) => {
    setUser(data);
  };

  const onSignOut = () => {
    localStorage.removeItem("uuid");
    localStorage.removeItem("name");
    localStorage.removeItem("type");
    setUser({uuid:'', name: '', type: ''});
  };

  return (
    <>
      <div id="myAlert" className="alert alert-primary fade" role="alert">
        <div className="text"></div>
      </div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login user={user} onSignIn={onSignIn} />} />
          <Route path="/register" element={<Register user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} onSignOut={onSignOut} />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
    </>
  )
}
