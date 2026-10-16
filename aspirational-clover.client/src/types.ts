import { Shape } from "./data/shapes";

export interface AnchorSignal {
  id: string;
  signalType: "show" | "hide";
  anchorType: "tooltip" | "popover";
  x: number;
  y: number;
  xPos: "left" | "center" | "right";
  yPos: "top" | "center" | "bottom";
  payload: unknown;
}

export type ToolTipSignal = Omit<AnchorSignal, "anchorType"> & { anchorType: "tooltip" } & {
  payload: {
    content: string;
  }
};

export type ToastSignal = { value: string; type: "success" | "error" | "warning" } | null;

export interface GraphicsMouseEvent {
  type: "down" | "up" | "click" | "move" | "dblclick";
  event: MouseEvent;
  shape?: Shape | null | undefined;
  updater?: ((initial: Shape, update: { dx: number, dy: number }) => Shape) | null | undefined;
}
