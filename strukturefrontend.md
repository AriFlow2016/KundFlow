# strukturefrontend.md

## 1. Översikt: Vad är Salesforce och varför är det relevant för vår applikation?

Salesforce är en molnbaserad CRM-plattform (Customer Relationship Management) som hjälper företag att organisera kunddata, effektivisera säljprocesser, hantera supportärenden och skapa rapporter. Genom att studera hur Salesforce är uppbyggt kan vi dra lärdomar för att utveckla en **webbaserad** applikation på svenska, anpassad efter våra specifika behov och den svenska marknaden.

I vår applikation vill vi bland annat:
- **Lagra och organisera kundinformation** (kontakter, företag, leads, affärsmöjligheter).  
- **Integrera telefoni** (inkommande/utgående samtal, samtalslogg, nummeruppslag, NIX-kontroll).  
- **Skapa rapporter och dashboards** för analys av sälj- och supportinsatser.  
- **Uppfylla GDPR-krav** och andra lokala regelverk (t.ex. NIX, PUL).  
- **Erbjuda åtkomst direkt i webbläsaren** på dator och mobil, så att användare kan logga in var de än befinner sig.

---

## 2. Viktiga delar i Salesforce och motsvarande lösningar i vår webbaserade app

### 2.1 Standardobjekt och datamodell

1. **Leads (Prospekts)**
   - Oidentifierade eller potentiella kunder som ännu inte klassats som ”aktiva konton”.
   - I vår app: En ”Lead”-entitet för att snabbt samla in nya kontaktuppgifter innan de konverteras till ”Kund”.

2. **Konton (Accounts)**
   - Företag eller privatpersoner som är kunder, partners eller leverantörer.
   - I vår app: Här lagrar vi central information om kunder, som adresser, organisationsnummer eller andra relevanta uppgifter.

3. **Kontakter (Contacts)**
   - Personer som är kopplade till ett konto.
   - I vår app: Extra viktigt när vi jobbar med telefonifunktioner, eftersom varje kontakt har unika telefonnummer och e-postadresser.

4. **Affärsmöjligheter (Opportunities)**
   - Potentiella affärer, med estimerat värde och förväntat slutdatum.
   - I vår app: Vi kan implementera en säljpipeline med olika steg (t.ex. ”Prospektering”, ”Offert”, ”Förhandling”, ”Vunnen/Förlorad”).

5. **Ärenden (Cases)**
   - Supportärenden eller kundservicefrågor.
   - I vår app: Om vi inför supportfunktionalitet, är detta centralt för att strukturera problem och lösningar.

**Varför detta är viktigt:** En tydlig datamodell gör det enklare att knyta samman kund-, säljmöjlighets- och supportinformation. Salesforce framgång bygger mycket på en välplanerad modell som vi kan inspireras av och anpassa för svenska förhållanden – samtidigt som vi gör den fullt **webbaserad** för enkel åtkomst.

---

### 2.2 Arkitektur och anpassningsbarhet

- **Metadatadriven arkitektur**  
  Salesforce sparar all konfiguration (fält, layouter, valideringsregler) som metadata.  
  **Vår lösning:** Låt konfiguration (nya fält, valideringslogik) ligga separat från kärnkoden, så att vi kan uppdatera och anpassa systemet utan att ändra koden i grunden.

- **API och integrationer**  
  Salesforce erbjuder REST-, SOAP- och streaming-API:er.  
  **Vår lösning:** Vi skapar ett robust REST- eller GraphQL-API som är lätt att integrera med telefonsystem och eventuella framtida mobilappar eller tredjepartsverktyg.

- **Multi-tenant (valfritt)**  
  Salesforce kör alla kunder i samma kodbas med skilda data.  
  **Vår lösning:** Om vi vill erbjuda detta till många olika företag kan en multi-tenant-arkitektur vara en fördel. Annars kan vi köra single-tenant men förlora viss skalbarhet.

---

## 3. Telefonifunktioner och lokala svenska förbättringar

Då vi är fokuserade på telefoni i den svenska marknaden vill vi erbjuda effektiva samtalsflöden, direkt i webbläsaren oavsett var användaren är.

### 3.1 Inbyggd telefonintegration (CTI)

1. **Click-to-Call**  
   - Användaren klickar på ett telefonnummer i appen och ringer automatiskt via en IP-telefoni-/softphone-lösning.

2. **Popup vid inkommande samtal**  
   - När någon ringer, visas en notis i vår app som visar kund-/kontaktuppgifter (om numret redan finns i systemet).

3. **Samtalslogg**  
   - Alla samtal registreras automatiskt med tid, datum, samtalslängd och anteckningar för framtida uppföljning.

### 3.2 Nummeruppslag och NIX-kontroll

- **Eniro/Hitta-integration**  
  - Om numret inte finns i systemet, kan appen göra ett uppslag i en extern katalog (t.ex. Eniro/Hitta) för att automatiskt fylla i namn och adress.

- **NIX-registret**  
  - Inbyggd kontroll mot NIX för att inte ringa privata nummer som är spärrade för marknadsföring.

### 3.3 Inspelning och transkribering (om juridiskt möjligt)

- **Samtalsinspelning**  
  - Spela in samtal för kvalitetskontroll eller dokumentation. Kräver samtycke och efterlevnad av GDPR.  
- **Tal-till-text**  
  - Möjlighet att automatiskt transkribera samtal för sökbarhet och enklare uppföljning.

---

## 4. Användargränssnitt och designprinciper

Eftersom appen är webbaserad ska den fungera lika bra i en datorwebbläsare som i en mobilwebbläsare.

### 4.1 Säljpipeline och ärendehantering

- **Dra-och-släpp-pipeline**  
  - Låt användaren visuellt flytta affärsmöjligheter mellan olika stadier (t.ex. ”Prospektering” → ”Offert”).
- **Ärenden (Cases)**  
  - Skapa, prioritera och tilldela ärenden. Vid inkommande telefonsamtal kan användaren omvandla samtalet till ett ärende med en knapptryckning.

### 4.2 Dashboards och rapporter

- **Standardrapporter**  
  - T.ex. antal samtal per dag, konverteringsgrad från leads till affärer, antal öppna ärenden.
- **Anpassade rapporter**  
  - Användare kan skapa egna filter och diagram, samt spara eller dela dem med kollegor.
- **Dashboard-widgetar**  
  - Ger en snabb överblick av nyckeltal i realtid.

### 4.3 Mobilvänlig upplevelse

- **Responsiv design**  
  - Gränssnittet anpassar sig automatiskt till skärmens storlek, så det fungerar smidigt i både dator- och mobilwebbläsare.  
- **Offlinefunktionalitet (eventuellt)**  
  - Möjlighet att i framtiden implementera viss offlinekapacitet, så att användare kan se grunddata även när nätverksanslutning saknas.

---

## 5. Säkerhet, roller och behörigheter

### 5.1 Roll- och profilhantering

- **Roller** (ex. Säljare, Support, Administratör) med olika behörigheter för att visa/skapa/uppdatera data.  
- **Granulär åtkomst** på både objektnivå och fältnivå (endast vissa användare kan se eller ändra vissa fält).

### 5.2 Delningsregler

- **Standarddelning**: Alla i samma team kan se varandras data.  
- **Avancerad delning**: Endast ägaren och högre roll i hierarkin kan se data (privat modell).

### 5.3 GDPR och dataskydd

- **Samtyckeslogik**  
  - Möjlighet att spara kundens samtycke för kontakt eller inspelning.  
- **Rätt att bli bortglömd**  
  - Användare/kunder ska kunna få sin data anonymiserad eller raderad på begäran.  
- **Export av data**  
  - Kunden ska kunna få en kopia av sin personliga data vid behov.

---

## 6. Systemarkitektur och teknisk överblick

### 6.1 Lagerindelning

1. **Frontend (Presentationslager)**  
   - Webbaserad och responsiv (t.ex. React, Vue eller Angular).  
   - Visar kundregister, samtalshistorik, säljpipeline, ärenden, rapporter osv.

2. **API/Tjänstelager**  
   - REST- eller GraphQL-API för att hantera in- och utdata.  
   - Autentisering (t.ex. OAuth2 eller JWT) för att säkra åtkomsten.

3. **Affärslogik**  
   - Här ligger våra regler för arbetsflöden och valideringar (ex. ”Skicka mejl när en affär markeras som Vunnen”).

4. **Databas**  
   - Relationsdatabas (ex. PostgreSQL, MySQL) eller NoSQL, beroende på behoven av flexibilitet.  
   - Lagrar kunddata, kontakter, ärenden, samtalsloggar, m.m.

5. **Telefoni-/CTI-integration**  
   - Kommunikation med IP-telefoni, softphone eller tredjepartslösningar (ex. Telavox, Twilio, 3CX).  
   - Hanterar händelser för inkommande och utgående samtal.

---

## 7. Plan för införande och löpande utveckling

1. **Fas 1: Grundläggande CRM-funktioner**  
   - Konton, kontakter, leads, enkel affärsmöjlighetshantering.  
   - Enkel Click-to-Call direkt i webbläsaren.

2. **Fas 2: Utökad telefoni och ärenden**  
   - Popup för inkommande samtal, automatisk samtalslogg, inspelningsfunktion (om juridiskt ok).  
   - Ärendehantering (cases) för support.

3. **Fas 3: Rapporter och dashboards**  
   - Standardrapporter, anpassade rapporter, samt interaktiva dashboards.

4. **Fas 4: Automatisering och kalenderkoppling**  
   - Workflow-motor för avancerade processer, e-post- och SMS-utskick, integration mot kalender (Google/Outlook).

5. **Fas 5: Marknadsföringsmodul och tredjepartsintegrationer**  
   - Kampanjhantering (e-post/SMS) och koppling till extern marknadsföringsplattform.  
   - Eventuell ”app-butik” för egna och tredjeparts plugins.

---

## 8. Sammanfattning och nyckelinsikter

- **CRM-struktur**  
  Inspireras av Salesforce kärnobjekt (Konton, Kontakter, Leads, Affärsmöjligheter) men skräddarsy för vårt användningsfall och gör allt fullt **webbaserat**.
- **Telefonicentrerad funktionalitet**  
  CTI-integration, nummeruppslag (Eniro/Hitta), NIX-kontroll och automatisk samtalslogg för maximal effektivitet.
- **Svenska regler**  
  Viktiga lokala anpassningar som GDPR-hantering, NIX-registret, SNI-koder och relevanta adressformat.
- **Anpassningsbar arkitektur**  
  Metadatadrivet tänk, tydlig lagerindelning och robust API gör att appen är lätt att integrera och vidareutveckla.  
- **Stegvis utveckling**  
  Börja med grundläggande CRM och telefoni, utöka därefter med ärendehantering, rapporter, automation och eventuellt marknadsföring.

**Slutsats:**  
Denna webbaserade applikation kan nås var som helst genom dator eller mobilens webbläsare. Genom att kombinera inspiration från Salesforce med våra specifika telefonifunktioner och lokala behov, skapar vi ett kraftfullt CRM-verktyg för svenska företag som kräver smidig tillgång till kunddata och effektiva samtalsflöden.
