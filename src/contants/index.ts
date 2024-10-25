export const IMAGES = {
  DEFAULT_PROFILE: "https://i.ibb.co/MV9cG2N/default-profile.webp",
  LOGO: "https://i.ibb.co/dWGtjjS/komelon.png",
} as const;

export const API = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  TIMEOUT: 5000,
} as const;

export const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  POST: "/post",
} as const;

export const LIMITS = {
  POST_MAX_LENGTH: 500,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
} as const;
