import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/config/prisma";
import bcrypt from "bcrypt";

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: String(credentials.email),
            },
          });

          if (!user) {
            throw new Error("User does not exist");
          }

          const matchPassword = await bcrypt.compare(
            String(credentials.password),
            user.password
          );

          if (!matchPassword) {
            throw new Error("Incorrect password ");
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error("Internal Server Error ");
          }
        }
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
