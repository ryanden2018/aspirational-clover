import { TextBox } from "../data/shapes";

export function parseTextBoxContent(textBox: TextBox | null | undefined): string {
  if (!textBox?.content) return "";;
  try {
    const data = JSON.parse(textBox?.content ?? "") as { text: string };

    return data?.text ?? "";
  } catch (e) {
    console.log("error parsing text box content", e);
  }

  return "";
}

export function updateTextBoxContent(textBox: TextBox | null | undefined, newText: string): TextBox | null | undefined {
  if (!textBox) return textBox;
  return {
    ...textBox,
    content: JSON.stringify({ text: newText }),
  };
}
