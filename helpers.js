export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

// Формат вывода даты в комментарии
const fixNumbers = number => String(number).length < 2 ? '0' + number : number;

export const correctDate = date => {
  let year = (new Date(date)).getFullYear();
  let month = fixNumbers((new Date(date)).getMonth() + 1);
  let day = fixNumbers((new Date(date)).getDate());
  let hours = fixNumbers((new Date(date)).getHours());
  let minutes = fixNumbers((new Date(date)).getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Замена символов
export const replaceValue = (value) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
