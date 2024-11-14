import { RecoilRoot } from "recoil";
import { Suspense } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Appbar from "./pages/Appbar";

function App() {
  return (
    <>
      <RecoilRoot>
        <Appbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </RecoilRoot>
    </>
  );
}

export default App;
