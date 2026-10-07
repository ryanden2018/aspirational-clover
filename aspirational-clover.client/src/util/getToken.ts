import { apiCreateTokenUrl } from "../constants";

export async function getToken(): Promise<string> {
  return await fetch(apiCreateTokenUrl).then(response => response.text());
}
