import { TOKEN } from "../../config/constants";
export const SHOW_ACCOUNT = "SHOW_ACCOUNT";

export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const CHANGE_PAGE = "CHANGE_PAGE";

export function logoutUser() {
  localStorage.removeItem("ACCESS_TOKEN");
  return {
    type: LOGOUT_USER
  };
}

function fetchLogin(token) {
  //Lab
  localStorage.setItem(TOKEN, token);
}

export function login(user, token) {
  fetchLogin(token);
  return {
    type: LOGIN_USER,
    ...user
  };
}

function fetchLogout() {
  //Lab
  localStorage.removeItem(TOKEN);
}

export function logout() {
  fetchLogout();
  return {
    type: LOGOUT_USER
  };
}

export function pageState(mainpage){
  return {
    type: CHANGE_PAGE,
    mainpage:mainpage
  }
}

