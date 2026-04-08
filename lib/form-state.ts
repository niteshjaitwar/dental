export interface ActionState<TValues = Record<string, string>> {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<keyof TValues, string>>;
  values?: Partial<TValues>;
  payload?: Record<string, string>;
}

export const emptyActionState: ActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
