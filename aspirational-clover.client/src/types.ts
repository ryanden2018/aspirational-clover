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
