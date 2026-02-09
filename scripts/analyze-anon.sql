-- Détails des vrais anonymes
SELECT 
  pseudo, 
  email, 
  country, 
  department, 
  description,
  avatar IS NOT NULL as has_avatar,
  "createdAt",
  "lastSeenAt"
FROM "User" 
WHERE "isQuickAccess" = true 
  AND email LIKE '%@menhir.temp'
ORDER BY "createdAt" DESC
LIMIT 15;

-- Vérifier s'ils ont des messages envoyés
SELECT u.pseudo, COUNT(m.id) as messages_envoyes
FROM "User" u
LEFT JOIN "Message" m ON m."senderId" = u.id
WHERE u."isQuickAccess" = true 
  AND u.email LIKE '%@menhir.temp'
GROUP BY u.pseudo
ORDER BY messages_envoyes DESC;

-- Vérifier s'ils ont des likes
SELECT u.pseudo, COUNT(l.id) as likes_envoyes
FROM "User" u
LEFT JOIN "Like" l ON l."likerId" = u.id
WHERE u."isQuickAccess" = true 
  AND u.email LIKE '%@menhir.temp'
GROUP BY u.pseudo;

-- Vérifier les IPs ou user agents si disponibles dans les logs
