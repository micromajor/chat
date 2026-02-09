-- Compteur total isOnline
SELECT COUNT(*) as total_online FROM "User" WHERE "isOnline" = true;

-- Compteur avec lastSeenAt récent (5 min)
SELECT COUNT(*) as online_recent FROM "User" WHERE "isOnline" = true AND "lastSeenAt" >= NOW() - INTERVAL '5 minutes';

-- Fakes en ligne
SELECT COUNT(*) as fakes_online FROM "User" WHERE "isOnline" = true AND email LIKE '%@menhir.test';

-- Fakes avec lastSeenAt récent
SELECT COUNT(*) as fakes_recent FROM "User" WHERE "isOnline" = true AND email LIKE '%@menhir.test' AND "lastSeenAt" >= NOW() - INTERVAL '5 minutes';
