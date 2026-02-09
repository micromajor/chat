-- Vérifier Menhir_25738
SELECT pseudo, email, "isQuickAccess", "isOnline", "lastSeenAt" 
FROM "User" 
WHERE pseudo = 'Menhir_25738';

-- Vrais anonymes hors ligne (pas les fakes)
SELECT pseudo, email, "isOnline", "lastSeenAt" 
FROM "User" 
WHERE "isQuickAccess" = true 
  AND email NOT LIKE '%@menhir.test'
  AND "isOnline" = false
ORDER BY "lastSeenAt" DESC
LIMIT 15;

-- Fakes en ligne
SELECT COUNT(*) as fakes_online 
FROM "User" 
WHERE email LIKE '%@menhir.test' 
  AND "isOnline" = true;

-- Fakes hors ligne  
SELECT COUNT(*) as fakes_offline 
FROM "User" 
WHERE email LIKE '%@menhir.test' 
  AND "isOnline" = false;
