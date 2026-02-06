# Liste des Faux Profils - Le Menhir

Ce fichier documente tous les faux profils créés pour peupler la plateforme.
**Email pattern**: `fake.{pseudo_sans_points_underscores}@menhir.test`
**Mot de passe**: `FakeProfile2026!`

## Profils créés le 6 février 2026

### Batch 1 - Profils généraux (60 profils)

| Pseudo | Style |
|--------|-------|
| TomParis | Prénom + Ville |
| MaxLyon | Prénom + Ville |
| LucasNice | Prénom + Ville |
| HugoBdx | Prénom + Ville |
| LeoMtp | Prénom + Ville |
| NathanTls | Prénom + Ville |
| TheoNantes | Prénom + Ville |
| RaphaelStr | Prénom + Ville |
| LouisMars | Prénom + Ville |
| AdamLille | Prénom + Ville |
| Nico_38 | Prénom + Dept |
| Max.06 | Prénom + Dept |
| Tom_75 | Prénom + Dept |
| Alex.13 | Prénom + Dept |
| Sam_31 | Prénom + Dept |
| Ben.69 | Prénom + Dept |
| Matt_44 | Prénom + Dept |
| Chris.33 | Prénom + Dept |
| Julien_59 | Prénom + Dept |
| Olivier.34 | Prénom + Dept |
| MecViril38 | Descriptif |
| BgParis | Descriptif |
| TwinkLyon | Descriptif |
| BearMars | Descriptif |
| SportifNice | Descriptif |
| MuscleMan69 | Descriptif |
| RunnerBdx | Descriptif |
| GymBoyTls | Descriptif |
| SweetBoy06 | Descriptif |
| CoolGuy75 | Descriptif |
| Mathieu92 | Prénom + Année |
| Kevin87 | Prénom + Année |
| Antoine85 | Prénom + Année |
| Romain88 | Prénom + Année |
| Florian90 | Prénom + Année |
| JulienB | Prénom + Initiale |
| NicoG | Prénom + Initiale |
| MaximeP | Prénom + Initiale |
| XavierL | Prénom + Initiale |
| StephaneM | Prénom + Initiale |
| FrenchBoy | Style anglais |
| ParisLover | Style anglais |
| SouthernGuy | Style anglais |
| BeachBoy06 | Style anglais |
| MountainMan | Style anglais |
| CityBoy75 | Style anglais |
| NightOwl | Style anglais |
| SunnyGuy | Style anglais |
| ChillDude | Style anglais |
| GoodVibes | Style anglais |
| Jerem_Actif | Prénom + Trait |
| Marco.Discret | Prénom + Trait |
| Fred_Sympa | Prénom + Trait |
| Phil.Cool | Prénom + Trait |
| YanBg | Prénom court |
| Titi93 | Surnom + Dept |
| Lolo75 | Surnom + Dept |
| Didi06 | Surnom + Dept |
| Momo13 | Surnom + Dept |
| Jojo69 | Surnom + Dept |

### Batch 2 - Profils maghrébins (15 profils)

| Pseudo | Pays |
|--------|------|
| Karim_Bg | 🇲🇦 Maroc |
| MohamedCasa | 🇲🇦 Maroc |
| YassineOran | 🇩🇿 Algérie |
| AmineTunis | 🇹🇳 Tunisie |
| Said.Alger | 🇩🇿 Algérie |
| RachidRabat | 🇲🇦 Maroc |
| IliesConstantine | 🇩🇿 Algérie |
| SofianeT | 🇹🇳 Tunisie |
| Nabil_Marra | 🇲🇦 Maroc |
| ZakariaDZ | 🇩🇿 Algérie |
| MehdiSfax | 🇹🇳 Tunisie |
| BilalTanger | 🇲🇦 Maroc |
| AdilDZ | 🇩🇿 Algérie |
| OmarTunis | 🇹🇳 Tunisie |
| Tarik.Fes | 🇲🇦 Maroc |

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
