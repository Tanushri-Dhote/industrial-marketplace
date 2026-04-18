export const loginAs = (role) => {
  const user = {
    name: role,
    role: role,
    token: "dummy-token"
  };
  localStorage.setItem("user", JSON.stringify(user));
  window.location.reload();
};

export const logout = () => {
  localStorage.removeItem("user");
  window.location.reload();
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};