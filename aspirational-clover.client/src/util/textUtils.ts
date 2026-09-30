import { TextBox } from "../data/shapes";

export function parseTextBoxContent(textBox: TextBox): string {
  try {
    const data = JSON.parse(textBox?.content ?? "") as { text: string };

    return data?.text ?? "";
  } catch (e) {
    console.log("error parsing text box content", e);
  }

  return "";
}
