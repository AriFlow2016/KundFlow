export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Disqualified' | 'Converted';
  source?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  nixRegistered: boolean;
}

export interface Account {
  _id: string;
  name: string;
  accountType: 'Customer' | 'Partner' | 'Supplier';
  organizationNumber?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: {
    street?: string;
    postalCode?: string;
    city?: string;
    country: string;
  };
  industry?: string;
  sniCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  account: string | Account;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  nixRegistered: boolean;
  gdprConsent: {
    marketing: boolean;
    callRecording: boolean;
    consentDate?: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  _id: string;
  name: string;
  account: string | Account;
  primaryContact?: string | Contact;
  amount?: number;
  stage: 'Prospecting' | 'Qualification' | 'Needs Analysis' | 'Value Proposition' |
         'Quote' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  expectedCloseDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  _id: string;
  subject: string;
  description: string;
  account: string | Account;
  contact?: string | Contact;
  status: 'New' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  origin: 'Phone' | 'Email' | 'Web' | 'Other';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  callRecord?: {
    recordingUrl?: string;
    duration?: number;
    callTime?: Date;
  };
}

export interface CallLog {
  _id: string;
  callType: 'Incoming' | 'Outgoing' | 'Missed';
  phoneNumber: string;
  contact?: string | Contact;
  account?: string | Account;
  user: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  notes?: string;
  recordingUrl?: string;
  callOutcome?: 'Answered' | 'Voicemail' | 'No Answer' | 'Busy' | 'Failed' | 'Completed';
}
