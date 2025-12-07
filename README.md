# EasyPay Scraping

Script Playwright pour extraire les informations des travailleurs depuis EasyPay.

## Installation

```bash
npm install
```

## Utilisation

### Extraction des données d'un travailleur

1. **Lancez le script** :

```bash
npm test
```

2. Le script va :
   - Ouvrir automatiquement http://pceasy/
   - Attendre que vous vous connectiez manuellement
   - Attendre que vous naviguiez vers la fiche du travailleur (timeout de 5 minutes)
   - Extraire automatiquement toutes les données
   - Sauvegarder les résultats dans `./output/worker-data-[timestamp].json`

### Données extraites

Le script extrait **toutes les informations** disponibles sur la fiche travailleur :

#### 📋 Données d'identification
- Nom, prénom, initiale
- Adresse complète
- Numéro registre national
- Date et lieu de naissance
- Sexe, handicap
- Distance domicile-travail
- Moyen de transport

#### 📞 Données supplémentaires
- Numéros de téléphone (fixe, mobile, urgence)
- Emails (professionnel et privé)
- Numéro d'entreprise
- Numéro d'identification fiscale

#### 📝 Données du contrat
- Dates d'entrée et de sortie
- Raison de sortie
- Langue
- Type de contrat

#### 👨‍👩‍👧‍👦 Données familiales
- État civil
- Informations du partenaire
- Personnes à charge
- Allocations familiales

#### 💰 Données de paiement
- Type de paiement
- IBAN
- Bénéficiaire

#### ⚖️ Saisie sur salaire
- Montants de saisie
- Pension alimentaire
- Créancier

#### 📊 Grilles de données
- Périodes Dimona actives
- Périodes de travailleur protégé
- Historique des contrats

### Format de sortie

Les données sont sauvegardées au format JSON avec la structure suivante :

```json
{
  "extractionDate": "2025-12-07T22:00:00.000Z",
  "workerInfo": {
    "identification": { ... },
    "additionalData": { ... },
    "contractData": { ... },
    "familyData": { ... },
    "paymentData": { ... },
    "wageGarnishment": { ... },
    "additionalInfo": { ... },
    "categories": { ... },
    "dimonaPeriods": [ ... ],
    "protectedWorker": [ ... ],
    "contracts": [ ... ]
  }
}
```

## Configuration

Le script utilise la configuration Playwright par défaut définie dans `playwright.config.ts`.

### Timeout

Le script attend jusqu'à **2 minutes** (120 secondes) que vous vous connectiez et naviguiez vers la page du travailleur.

### Dossier de sortie

Les fichiers JSON sont sauvegardés dans le dossier `./output/` avec un timestamp dans le nom du fichier.

## Développement

### Structure du projet

```
easyPay-scraping/
├── tests/
│   └── extract-worker-info.spec.ts  # Script d'extraction principal
├── output/                           # Dossier des fichiers JSON générés
├── playwright.config.ts              # Configuration Playwright
├── package.json
└── README.md
```

### Ajouter de nouveaux champs

Pour extraire des champs supplémentaires, ajoutez-les dans le fichier `tests/extract-worker-info.spec.ts` :

```typescript
// Exemple : ajouter un nouveau champ
nouveauChamp: await getFieldValue('#idDuChamp'),
```

## Dépannage

### Le script ne trouve pas la page

- Assurez-vous d'être connecté à EasyPay
- Vérifiez que vous êtes bien sur la page de la fiche travailleur
- Le script attend la présence de l'élément `.tab-content`

### Champs vides dans le JSON

- C'est normal : le script extrait **tous les champs**, même vides
- Cela permet d'avoir une vue complète de la structure des données

### Erreur de timeout

- Augmentez le timeout dans le code si nécessaire :
```typescript
await page.waitForSelector('.tab-content', { timeout: 180000 }); // 3 minutes
```

## Licence

ISC
