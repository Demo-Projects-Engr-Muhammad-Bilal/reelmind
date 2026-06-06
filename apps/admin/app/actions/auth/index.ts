export type { AuthResponse } from "./auth"; // ⚡ Type bhi export kar di taake baqi components mein use ho sake

export {
  loginCredentialsAction,
  verify2FALoginAction,
  sendPasswordResetLinkAction, // ⚡ Fix: Corrected name from auth.ts
  resetPasswordAction,
  logoutAction,
} from "./auth";