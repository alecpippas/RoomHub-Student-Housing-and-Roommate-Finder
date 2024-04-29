import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function InboxScreen() {
  /* --------- This part is to check if user is authentized to view this page --------*/
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.userLogin);
  if (!localStorage.getItem("userInfo")) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}
export default InboxScreen;
