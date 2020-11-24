import cookie from 'react-cookies'//npm install react-cookies --save
const tokenAdmin = "adminToken";
const Username = "username";
const IsLeaf = 'isLeaf';
const User = "user";

export function setToken(value) {
  cookie.save(tokenAdmin, value);
}
export function setUsername(value) {
  cookie.save(Username, value);
}

export function getToken() {
  return cookie.load(tokenAdmin);
}
export function getUsername() {
  return cookie.load(Username);
}
export function setUser(value) {
  cookie.save(User, value);
}
export function getUser() {
  return cookie.load(User);
}
export function setIsLeaf(id, value,) {
  cookie.save(IsLeaf, id, value);
}
export function getIsLeaf() {
  return cookie.load(IsLeaf);
}