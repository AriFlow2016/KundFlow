# KundFlow

KundFlow är ett svenskt CRM-system (Customer Relationship Management) med särskilt fokus på telefonifunktioner, anpassat för den svenska marknaden.

## Snabbstart

För att starta en enkel demo av KundFlow:

1. Öppna terminalfönster
2. Kör följande kommandon:

```bash
cd /Users/johannilsson/KundFlow
node super-simple.js
```

3. Öppna webbläsaren och gå till http://localhost:3000

## Alternativ installation

Om du vill köra den fullständiga installationen:

### Förberedelse

```bash
# Installera nödvändiga paket
npm init -y
npm install express cors

# Skapa grundläggande katalogstruktur
mkdir -p frontend/public
mkdir -p backend/src/models
```

### Starta backend och frontend

För att starta backend-servern:

```bash
cd /Users/johannilsson/KundFlow/backend
npx nodemon server.js
```

För att starta frontend-utvecklingsservern (i en separat terminal):

```bash
cd /Users/johannilsson/KundFlow/frontend
npx react-scripts start
```

## Projektstruktur

```
KundFlow/
├── backend/               # Express-backend
│   ├── config/            # Konfigurationsfiler
│   ├── src/
│   │   ├── controllers/   # API-kontroller
│   │   ├── models/        # Mongoose-modeller
│   │   ├── routes/        # API-rutter
│   │   ├── services/      # Affärslogik
│   │   └── utils/         # Hjälpfunktioner
│   └── server.js          # Backend-startpunkt
├── frontend/              # React-frontend
│   ├── public/            # Statiska filer
│   └── src/
│       ├── components/    # React-komponenter
│       ├── pages/         # Sidkomponenter
│       ├── services/      # API-anrop
│       ├── store/         # Tillståndshantering
│       ├── utils/         # Hjälpfunktioner
│       └── App.js         # Frontend-startpunkt
└── README.md              # Denna fil
```

## Funktioner

- **Hantering av kundinformation**: Konton, kontakter, leads, affärsmöjligheter
- **Integrerad telefoni**: Inkommande/utgående samtal, samtalslogg, nummeruppslag
- **NIX-kontroll**: Automatisk kontroll mot NIX-registret
- **GDPR-anpassad**: Hantering av samtycke för marknadsföring och samtalsinspelning
