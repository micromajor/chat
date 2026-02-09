-- Dernières inscriptions
SELECT pseudo, email, "isVerified", "isQuickAccess", "createdAt" 
FROM "User" 
WHERE "isQuickAccess" = false
ORDER BY "createdAt" DESC
LIMIT 10;

-- Recherche partielle du pseudo
SELECT pseudo, email, "isVerified", "createdAt" 
FROM "User" 
WHERE pseudo ILIKE '%jhpr%' OR pseudo ILIKE '%mur44%' OR email ILIKE '%jhpr%';
