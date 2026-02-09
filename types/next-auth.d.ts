import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string
    permissions?: string[]
  }
  interface Session {
    user: {
      id: string
      role: string
      permissions: string[]
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    permissions: string[]
  }
}
