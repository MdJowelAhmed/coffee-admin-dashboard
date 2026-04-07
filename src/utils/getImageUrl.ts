export const imageUrl = (path: string) => {
    if (!path || typeof path !== "string") {
    return "";
}

if (path.startsWith("http://") || path.startsWith("https://")) {
  return path;
} else {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}${path}`;
}
};