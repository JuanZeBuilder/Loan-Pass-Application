export default function username() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.username) {
    return user.username;
  } else {
    return {};
  }
}
