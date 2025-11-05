import { Bounce } from "react-toastify";

export function isLoggedIn(userType) {  
    let session = getObject(userType) || {};
    session = Object.keys(session).length && JSON.parse(session)
    let accessToken = (session?.token) || "";
    return accessToken;
  }
  
  
  export function getObject(key) {
    if (window && window.localStorage) {
        return window.localStorage.getItem(key);
    }
  }
  //=============================================toast object=========================================================
  export const commomObj = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition:Bounce,
} 
//========================================date handler====================================================================
export const handledate = (str) => {
  let data = str?.split("T");
  if (data) {
    let dataa = data[0].split("-")
    return `${dataa[2]}-${dataa[1]}-${dataa[0]}`
  } else {
    return ""
  }
}