/**
 * Gestion de la suppression automatique des messages selon les règles :
 * - Utilisateurs inscrits : messages supprimés 15 min après leur dernière connexion
 * - Utilisateurs anonymes (accès rapide) : messages supprimés immédiatement à la déconnexion
 */

import { prisma } from "./prisma";

/**
 * Supprime les messages expirés
 * À exécuter régulièrement via un cron job
 */
export async function cleanupExpiredMessages() {
  const now = new Date();
  
  try {
    const result = await prisma.message.deleteMany({
      where: {
        expiresAt: {
          lte: now, // Messages dont la date d'expiration est dépassée
        },
      },
    });
    
    console.log(`[Cleanup] ${result.count} messages expirés supprimés`);
    return result.count;
  } catch (error) {
    console.error("[Cleanup] Erreur lors de la suppression des messages:", error);
    throw error;
  }
}

/**
 * Définit la date d'expiration des messages d'un utilisateur inscrit
 * À appeler lors de la déconnexion
 */
export async function setMessagesExpirationForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isQuickAccess: true },
  });
  
  if (!user) return;
  
  // Pour les utilisateurs anonymes : suppression immédiate
  // Pour les inscrits : 1 heure après la dernière connexion (pour laisser le temps de revenir)
  const expiresAt = user.isQuickAccess 
    ? new Date() // Maintenant (suppression immédiate)
    : new Date(Date.now() + 60 * 60 * 1000); // Dans 1 heure
  
  try {
    // Met à jour tous les messages de cet utilisateur (envoyés et reçus)
    const [sentResult, receivedResult] = await Promise.all([
      prisma.message.updateMany({
        where: {
          senderId: userId,
          expiresAt: null, // Uniquement les messages qui n'ont pas déjà une date d'expiration
        },
        data: {
          expiresAt,
        },
      }),
      prisma.message.updateMany({
        where: {
          receiverId: userId,
          expiresAt: null,
        },
        data: {
          expiresAt,
        },
      }),
    ]);
    
    const totalUpdated = sentResult.count + receivedResult.count;
    console.log(
      `[Expiration] ${totalUpdated} messages marqués pour expiration à ${expiresAt.toISOString()} (utilisateur ${user.isQuickAccess ? "anonyme" : "inscrit"})`
    );
    
    return totalUpdated;
  } catch (error) {
    console.error("[Expiration] Erreur lors de la définition de l'expiration:", error);
    throw error;
  }
}

/**
 * Annule l'expiration des messages d'un utilisateur
 * À appeler lors de la reconnexion
 */
export async function cancelMessagesExpirationForUser(userId: string) {
  try {
    const [sentResult, receivedResult] = await Promise.all([
      prisma.message.updateMany({
        where: {
          senderId: userId,
          expiresAt: { not: null },
        },
        data: {
          expiresAt: null,
        },
      }),
      prisma.message.updateMany({
        where: {
          receiverId: userId,
          expiresAt: { not: null },
        },
        data: {
          expiresAt: null,
        },
      }),
    ]);
    
    const totalUpdated = sentResult.count + receivedResult.count;
    console.log(`[Expiration] ${totalUpdated} messages réactivés (reconnexion)`);
    
    return totalUpdated;
  } catch (error) {
    console.error("[Expiration] Erreur lors de l'annulation de l'expiration:", error);
    throw error;
  }
}

/**
 * Supprime immédiatement tous les messages d'un utilisateur anonyme
 * À appeler lors de la suppression du compte d'accès rapide
 */
export async function deleteAllMessagesForQuickAccessUser(userId: string) {
  try {
    const result = await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });
    
    console.log(`[Cleanup] ${result.count} messages supprimés pour l'utilisateur anonyme`);
    return result.count;
  } catch (error) {
    console.error("[Cleanup] Erreur lors de la suppression des messages:", error);
    throw error;
  }
}

/**
 * Supprime toutes les conversations d'un utilisateur anonyme
 * Les messages sont supprimés en cascade (onDelete: Cascade dans le schéma)
 * À appeler quand un anonyme passe hors ligne
 */
export async function deleteConversationsForQuickAccessUser(userId: string) {
  try {
    // Récupérer les IDs des conversations où l'utilisateur participe
    const participations = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
    });
    
    const conversationIds = participations.map(p => p.conversationId);
    
    if (conversationIds.length === 0) {
      console.log(`[Cleanup] Aucune conversation à supprimer pour l'utilisateur anonyme ${userId}`);
      return 0;
    }
    
    // Supprimer les conversations (messages et participants supprimés en cascade)
    const result = await prisma.conversation.deleteMany({
      where: {
        id: { in: conversationIds },
      },
    });
    
    console.log(`[Cleanup] ${result.count} conversation(s) supprimée(s) pour l'utilisateur anonyme ${userId}`);
    return result.count;
  } catch (error) {
    console.error("[Cleanup] Erreur lors de la suppression des conversations:", error);
    throw error;
  }
}
