"use client";
import { logoutAction } from "../../actions/auth"

export const LogoutButton = () => {
  return (
    <button 
      onClick={async () => await logoutAction()}
      className="text-red-900/50 hover:text-red-500 transition-colors cursor-pointer"
    >
      [ Cerrar Sesión ]
    </button>
  );
};