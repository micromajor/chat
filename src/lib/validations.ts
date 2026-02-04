import { z } from "zod";

// Validation de l'inscription
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Email invalide")
      .transform((v) => v.toLowerCase()),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmez votre mot de passe"),
    pseudo: z
      .string()
      .min(3, "Le pseudo doit contenir au moins 3 caractères")
      .max(20, "Le pseudo ne peut pas dépasser 20 caractères")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores"
      ),
    birthDate: z.string().min(1, "La date de naissance est requise"),
    acceptCGU: z.boolean().refine((v) => v === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
    acceptPrivacy: z.boolean().refine((v) => v === true, {
      message: "Vous devez accepter la politique de confidentialité",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const isAdult =
        age > 18 || (age === 18 && monthDiff >= 0 && today.getDate() >= birthDate.getDate());
      return isAdult;
    },
    {
      message: "Vous devez avoir au moins 18 ans",
      path: ["birthDate"],
    }
  );

export type RegisterInput = z.infer<typeof registerSchema>;

// Validation de la connexion
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide")
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Validation du profil
export const profileUpdateSchema = z.object({
  pseudo: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères")
    .max(20, "Le pseudo ne peut pas dépasser 20 caractères")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores"
    )
    .optional(),
  avatar: z.string().optional(), // Photo de profil en base64
  city: z.string().max(100, "La ville ne peut pas dépasser 100 caractères").optional(),
  region: z.string().max(100, "La région ne peut pas dépasser 100 caractères").optional(),
  description: z
    .string()
    .max(280, "La description ne peut pas dépasser 280 caractères")
    .optional(),
  searchAgeMin: z.number().min(18).max(99).optional(),
  searchAgeMax: z.number().min(18).max(99).optional(),
  searchDistance: z.number().min(1).max(500).optional(),
  isInvisible: z.boolean().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Validation des messages
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
  receiverId: z.string().min(1, "Destinataire requis"),
});

export type MessageInput = z.infer<typeof messageSchema>;

// Validation du signalement
export const reportSchema = z.object({
  reportedId: z.string().min(1, "Utilisateur à signaler requis"),
  reason: z.enum([
    "HARASSMENT",
    "SPAM",
    "FAKE_PROFILE",
    "INAPPROPRIATE_CONTENT",
    "UNDERAGE",
    "OTHER",
  ]),
  description: z.string().max(1000, "Description trop longue").optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;

// Validation de la recherche
export const searchSchema = z.object({
  ageMin: z.number().min(18).max(99).optional(),
  ageMax: z.number().min(18).max(99).optional(),
  city: z.string().optional(),
  search: z.string().optional(), // Recherche par pseudo
  isOnline: z.boolean().optional(),
  hasPhoto: z.boolean().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(50).optional().default(20),
});

export type SearchInput = z.infer<typeof searchSchema>;

// Validation mot de passe oublié
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Email invalide")
    .transform((v) => v.toLowerCase()),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Validation réinitialisation mot de passe
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string().min(1, "Confirmez votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
