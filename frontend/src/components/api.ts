import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0];

export const API_URL = `http://${host ?? "localhost"}:3000`;
