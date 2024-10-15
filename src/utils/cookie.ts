const options = `samesite=strict;path=/;${import.meta.env.PROD ? ";secure" : ""}`;

export function setCookie(key: string, value: string) {
  window.document.cookie = `${key}=${value};${options}`;
}

export function removeCookie(key: string) {
  window.document.cookie = `${key}=;max-age=0;${options}`;
}

export function getCookie(key: string) {
  const cookies = new Map<string, string>();
  const entries = window.document.cookie.split("; ");

  for (const entry of entries) {
    const equal = entry.indexOf("=");
    cookies.set(entry.slice(0, equal), entry.slice(equal + 1));
  }

  return cookies.get(key);
}
