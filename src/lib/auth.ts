import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      pseudo: string;
      avatar?: string;
      isVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    pseudo: string;
    avatar?: string;
    isVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    pseudo: string;
    avatar?: string;
    isVerified: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        pseudo: { label: "Pseudo", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.pseudo || !credentials?.password) {
          throw new Error("Pseudo et mot de passe requis");
        }

        // Recherche par pseudo (insensible à la casse)
        const user = await prisma.user.findFirst({
          where: { 
            pseudo: { 
              equals: credentials.pseudo,
              mode: 'insensitive'
            }
          },
        });

        if (!user) {
          throw new Error("Identifiants invalides");
        }

        if (user.isBanned) {
          throw new Error("Votre compte a été suspendu");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Identifiants invalides");
        }

        // Vérification email obligatoire
        if (!user.isVerified) {
          throw new Error("EMAIL_NON_VERIFIE");
        }

        if (!isPasswordValid) {
          throw new Error("Identifiants invalides");
        }

        // Mettre à jour le statut en ligne
        await prisma.user.update({
          where: { id: user.id },
          data: { isOnline: true, lastSeenAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          pseudo: user.pseudo,
          avatar: user.avatar || undefined,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.pseudo = user.pseudo;
        token.avatar = user.avatar;
        token.isVerified = user.isVerified;
      }

      // Mise à jour de la session
      if (trigger === "update" && session) {
        token.pseudo = session.pseudo || token.pseudo;
        token.avatar = session.avatar || token.avatar;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        pseudo: token.pseudo,
        avatar: token.avatar,
        isVerified: token.isVerified,
      };
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Mettre hors ligne à la déconnexion
      if (token?.id) {
        await prisma.user.update({
          where: { id: token.id as string },
          data: { isOnline: false, lastSeenAt: new Date() },
        }).catch(() => {
          // Ignorer l'erreur si l'utilisateur n'existe plus
        });
      }
    },
  },
  pages: {
    signIn: "/connexion",
    signOut: "/deconnexion",
    error: "/connexion",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
