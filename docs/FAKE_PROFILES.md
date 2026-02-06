# Liste des Faux Profils - Le Menhir

Ce fichier documente tous les faux profils créés pour peupler la plateforme.
**Email pattern**: `fake.{pseudo}@menhir.test`
**Mot de passe**: `FakeProfile2026!`

## Profils créés le 6 février 2026

### Batch 1 - Profils généraux (50 profils)

| # | Pseudo | Âge | Pays | Département |
|---|--------|-----|------|-------------|
| 1 | BogossActif336 | 39 | FR | 65 |
| 2 | BogossPassif753 | 45 | FR | 03 |
| 3 | MecViril791 | 27 | FR | 38 |
| 4 | JHChaud909 | 35 | BE | - |
| 5 | GarsCool286 | 21 | FR | 03 |
| 6 | MecPoilu371 | 18 | FR | 73 |
| 7 | SportifSexy523 | 36 | FR | 59 |
| 8 | BearGentil829 | 23 | FR | 44 |
| 9 | OursCalin832 | 46 | FR | 69 |
| 10 | TwinkMignon158 | 28 | FR | 83 |
| 11 | MecDirect924 | 18 | FR | 01 |
| 12 | BogossSympa579 | 20 | FR | 01 |
| 13 | GarsDiscret326 | 30 | FR | 69 |
| 14 | MecSportif777 | 34 | FR | 13 |
| 15 | ActifDoux914 | 46 | FR | 84 |
| 16 | PassifCoquin704 | 19 | FR | 85 |
| 17 | BisouBogoss925 | 18 | FR | 71 |
| 18 | MecCurieux510 | 25 | FR | 45 |
| 19 | GarsSensuel240 | 43 | FR | 85 |
| 20 | BogossBrun481 | 26 | FR | 44 |
| 21 | BlondSexy926 | 24 | FR | 21 |
| 22 | RouxCharmant824 | 41 | FR | 64 |
| 23 | MecTatoue442 | 20 | FR | 65 |
| 24 | GarsMuscu703 | 30 | CH | - |
| 25 | FitnessBoy534 | 45 | FR | 24 |
| 26 | RunnerHot416 | 22 | FR | 13 |
| 27 | NageurSexy212 | 40 | FR | 34 |
| 28 | CyclisteFit167 | 28 | FR | 04 |
| 29 | BoxeurViril742 | 40 | BE | - |
| 30 | RugbyMan952 | 32 | FR | 84 |
| 31 | FootBoy773 | 34 | FR | 83 |
| 32 | GymBoy552 | 28 | FR | 42 |
| 33 | YogaMan338 | 26 | FR | 10 |
| 34 | DanseurSexy268 | 33 | FR | 37 |
| 35 | ArtisteBohème312 | 34 | FR | 06 |
| 36 | MusicienCool912 | 26 | FR | 13 |
| 37 | ChefCuisto953 | 48 | FR | 38 |
| 38 | InfoSexy215 | 18 | FR | 49 |
| 39 | GarsBouclé946 | 30 | FR | 83 |
| 40 | MecRasé572 | 18 | FR | 89 |
| 41 | BarbuSexy755 | 54 | BE | - |
| 42 | MoustachuHot730 | 52 | FR | 54 |
| 43 | DaddyCool205 | 32 | FR | 73 |
| 44 | JeuneLouis153 | 23 | BE | - |
| 45 | MatthieuH763 | 46 | FR | 73 |
| 46 | LucasBg133 | 28 | FR | 57 |
| 47 | ThomasSexy382 | 32 | BE | - |
| 48 | HugoHot987 | 47 | FR | 11 |
| 49 | LeoCharmant769 | 31 | FR | 50 |
| 50 | NathanViril340 | 28 | CA | - |

### Batch 2 - Profils maghrébins (15 profils)

| # | Pseudo | Âge | Département |
|---|--------|-----|-------------|
| 1 | KarimBg716 | 28 | 75 |
| 2 | MohamedSexy280 | 25 | 06 |
| 3 | YassineHot620 | 23 | 95 |
| 4 | AmineCool194 | 30 | 34 |
| 5 | SaidViril959 | 35 | 06 |
| 6 | RachidMuscle780 | 32 | 06 |
| 7 | IliesCharmant400 | 22 | 93 |
| 8 | SofianeBeur802 | 27 | 38 |
| 9 | NabilDoux405 | 29 | 31 |
| 10 | ZakariaBg810 | 24 | 93 |
| 11 | MehdiSportif748 | 26 | 38 |
| 12 | BilalDiscret404 | 31 | 38 |
| 13 | AdilCurieux802 | 21 | 94 |
| 14 | OmarPassionné683 | 34 | 95 |
| 15 | TarikSensuel499 | 28 | 31 |

---

## Instructions de maintenance

### Lister tous les faux profils en base
```sql
SELECT pseudo, email, country, department, "isOnline", "lastSeenAt" 
FROM "User" 
WHERE email LIKE '%@menhir.test' 
ORDER BY pseudo;
```

### Supprimer tous les faux profils
```sql
DELETE FROM "User" WHERE email LIKE '%@menhir.test';
```

### Supprimer un profil spécifique
```sql
DELETE FROM "User" WHERE pseudo = 'NomDuPseudo';
```

### Compter les profils en ligne
```sql
SELECT COUNT(*) as online_count 
FROM "User" 
WHERE email LIKE '%@menhir.test' AND "isOnline" = true;
```

---

## Cron de randomisation

Le script `scripts/randomize-fake-online.ts` est exécuté toutes les heures par cron.
Il garantit un minimum de **30 profils en ligne** à chaque exécution.

Cron configuré sur le serveur:
```
0 * * * * cd /home/menhir/menhir && DATABASE_URL='postgresql://menhir:menhir2026secure!@localhost:5432/menhir?schema=public' /usr/bin/npx tsx scripts/randomize-fake-online.ts >> /home/menhir/logs/fake-online.log 2>&1
```
