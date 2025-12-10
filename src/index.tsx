// import React from "react";
// import ReactDOM from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import "./index.css";
// import reportWebVitals from "./reportWebVitals";
// import Routes from "./routes/Routes";
// import { AuthContextProvider } from "./context/AuthContext";
// import { Toaster } from "sonner";

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <AuthContextProvider>
//        <Toaster position="bottom-right" richColors />
//       <RouterProvider router={Routes} />
//     </AuthContextProvider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Routes from "./routes/Routes";
import { Toaster } from "sonner";
import { LanguageProvider } from "./i18n/LanguageContext"; //
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <Toaster position="bottom-right" richColors />
        <RouterProvider router={Routes} />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
