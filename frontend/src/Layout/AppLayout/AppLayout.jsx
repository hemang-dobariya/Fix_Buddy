import React, { memo } from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">{children}</div>
    </div>
  );
};

export default memo(AppLayout);
