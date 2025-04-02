export default {
  common: {
    save: 'Spara',
    cancel: 'Avbryt',
    delete: 'Radera',
    edit: 'Redigera',
    create: 'Skapa',
    search: 'Sök',
    back: 'Tillbaka',
    next: 'Nästa',
    yes: 'Ja',
    no: 'Nej',
    all: 'Alla',
    loading: 'Laddar...',
    noResults: 'Inga resultat hittades',
    filters: 'Filter',
    details: 'Detaljer',
    actions: 'Åtgärder'
  },
  menu: {
    dashboard: 'Dashboard',
    leads: 'Leads',
    accounts: 'Konton',
    contacts: 'Kontakter',
    opportunities: 'Affärsmöjligheter',
    cases: 'Ärenden',
    callLogs: 'Samtalsloggar',
    reports: 'Rapporter',
    settings: 'Inställningar'
  },
  entities: {
    lead: {
      singular: 'Lead',
      plural: 'Leads',
      new: 'Ny lead',
      fields: {
        firstName: 'Förnamn',
        lastName: 'Efternamn',
        email: 'E-post',
        phone: 'Telefon',
        company: 'Företag',
        status: 'Status',
        source: 'Källa',
        notes: 'Anteckningar',
        createdAt: 'Skapad',
        updatedAt: 'Uppdaterad',
        nixRegistered: 'NIX-registrerad'
      },
      statuses: {
        new: 'Ny',
        contacted: 'Kontaktad',
        qualified: 'Kvalificerad',
        disqualified: 'Diskvalificerad',
        converted: 'Konverterad'
      }
    },
    account: {
      singular: 'Konto',
      plural: 'Konton',
      new: 'Nytt konto',
      fields: {
        name: 'Namn',
        accountType: 'Kontotyp',
        organizationNumber: 'Organisationsnummer',
        phone: 'Telefon',
        email: 'E-post',
        website: 'Webbplats',
        address: 'Adress',
        street: 'Gatuadress',
        postalCode: 'Postnummer',
        city: 'Ort',
        country: 'Land',
        industry: 'Bransch',
        sniCode: 'SNI-kod'
      },
      types: {
        customer: 'Kund',
        partner: 'Partner',
        supplier: 'Leverantör'
      }
    },
    contact: {
      singular: 'Kontakt',
      plural: 'Kontakter',
      new: 'Ny kontakt',
      fields: {
        firstName: 'Förnamn',
        lastName: 'Efternamn',
        account: 'Konto',
        title: 'Titel',
        email: 'E-post',
        phone: 'Telefon',
        mobile: 'Mobil',
        nixRegistered: 'NIX-registrerad',
        gdprConsent: 'GDPR-samtycke',
        marketing: 'Marknadsföring',
        callRecording: 'Samtalsinspelning',
        consentDate: 'Samtyckesdatum',
        notes: 'Anteckningar'
      }
    },
    opportunity: {
      singular: 'Affärsmöjlighet',
      plural: 'Affärsmöjligheter',
      new: 'Ny affärsmöjlighet',
      fields: {
        name: 'Namn',
        account: 'Konto',
        primaryContact: 'Primär kontakt',
        amount: 'Belopp',
        stage: 'Stadium',
        probability: 'Sannolikhet',
        expectedCloseDate: 'Förväntat slutdatum',
        description: 'Beskrivning'
      },
      stages: {
        prospecting: 'Prospektering',
        qualification: 'Kvalificering',
        needsAnalysis: 'Behovsanalys',
        valueProposition: 'Värdeförslag',
        quote: 'Offert',
        negotiation: 'Förhandling',
        closedWon: 'Vunnen',
        closedLost: 'Förlorad'
      }
    },
    case: {
      singular: 'Ärende',
      plural: 'Ärenden',
      new: 'Nytt ärende',
      fields: {
        subject: 'Ämne',
        description: 'Beskrivning',
        account: 'Konto',
        contact: 'Kontakt',
        status: 'Status',
        priority: 'Prioritet',
        origin: 'Ursprung',
        assignedTo: 'Tilldelad till',
        callRecord: 'Samtalsinspelning'
      },
      statuses: {
        new: 'Nytt',
        inProgress: 'Pågående',
        waitingForCustomer: 'Väntar på kund',
        resolved: 'Löst',
        closed: 'Stängt'
      },
      priorities: {
        low: 'Låg',
        medium: 'Medium',
        high: 'Hög',
        critical: 'Kritisk'
      },
      origins: {
        phone: 'Telefon',
        email: 'E-post',
        web: 'Webb',
        other: 'Annat'
      }
    },
    callLog: {
      singular: 'Samtalslogg',
      plural: 'Samtalsloggar',
      new: 'Ny samtalslogg',
      fields: {
        callType: 'Samtalstyp',
        phoneNumber: 'Telefonnummer',
        contact: 'Kontakt',
        account: 'Konto',
        user: 'Användare',
        startTime: 'Starttid',
        endTime: 'Sluttid',
        duration: 'Längd',
        notes: 'Anteckningar',
        recordingUrl: 'Inspelningslänk',
        callOutcome: 'Resultat'
      },
      types: {
        incoming: 'Inkommande',
        outgoing: 'Utgående',
        missed: 'Missat'
      },
      outcomes: {
        answered: 'Besvarad',
        voicemail: 'Röstbrevlåda',
        noAnswer: 'Inget svar',
        busy: 'Upptaget',
        failed: 'Misslyckades',
        completed: 'Genomförd'
      }
    }
  },
  telephony: {
    call: 'Ring',
    answer: 'Svara',
    hangup: 'Lägg på',
    incomingCall: 'Inkommande samtal',
    outgoingCall: 'Utgående samtal',
    transfer: 'Överför',
    hold: 'Parkera',
    resume: 'Återuppta',
    mute: 'Tysta',
    unmute: 'Ljud på',
    dialer: 'Nummerslagare',
    recordCall: 'Spela in samtal',
    stopRecording: 'Stoppa inspelning',
    callDuration: 'Samtalslängd',
    afterCallWork: 'Efterarbete',
    callHistory: 'Samtalshistorik',
    nixCheck: 'NIX-kontroll'
  },
  dashboard: {
    welcome: 'Välkommen till KundFlow',
    recentActivity: 'Senaste aktivitet',
    upcomingTasks: 'Kommande uppgifter',
    salesOverview: 'Säljöversikt',
    openCases: 'Öppna ärenden',
    todaysCalls: 'Dagens samtal',
    pipelineValue: 'Pipeline-värde',
    leadConversionRate: 'Lead-konverteringsgrad'
  },
  errors: {
    general: 'Ett fel inträffade',
    notFound: 'Sidan kunde inte hittas',
    unauthorized: 'Du har inte behörighet till denna resurs',
    validation: 'Vänligen kontrollera inmatade uppgifter',
    serverError: 'Ett serverfel inträffade',
    connectionError: 'Kunde inte ansluta till servern'
  }
};
