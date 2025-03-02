import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { S3CustomerService } from '../services/s3CustomerService';

const router = express.Router();
const prisma = new PrismaClient();
const s3CustomerService = new S3CustomerService();

// Konfigurera multer för filuppladdning
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// POST /customers - Skapa ny kund
router.post('/', async (req, res) => {
  try {
    console.log('Attempting to create new customer with data:', JSON.stringify(req.body, null, 2));
    
    // 1. Skapa kund i databasen
    const customer = await prisma.customer.create({
      data: {
        ...req.body,
        addresses: {
          create: req.body.addresses,
        },
        contacts: {
          create: req.body.contacts,
        },
        industry: req.body.industry ? {
          create: req.body.industry,
        } : undefined,
      },
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      },
    });

    console.log('Successfully created customer in database');

    try {
      // 2. Skapa kundens mapp och loggfil i S3
      console.log('Creating customer folder in S3...');
      await s3CustomerService.createCustomerFolder(customer);
      console.log('Successfully created customer folder in S3');
    } catch (s3Error) {
      console.error('Error creating S3 folder:', s3Error);
      // Om S3-operationen misslyckas, ta bort kunden från databasen
      console.log('Rolling back customer creation...');
      await prisma.customer.delete({ where: { id: customer.id } });
      throw s3Error;
    }

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to create customer', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// POST /customers/:id/documents - Ladda upp dokument för en kund
router.post('/:id/documents', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    console.log(`Attempting to upload document for customer ${id}`);

    if (!req.file) {
      console.log('No file provided in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Hämta kunden
    console.log('Fetching customer details...');
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      }
    });

    if (!customer) {
      console.log(`No customer found with ID: ${id}`);
      return res.status(404).json({ error: 'Customer not found' });
    }

    // 2. Kontrollera att kundens S3-mapp existerar
    console.log('Checking if customer folder exists in S3...');
    const folderExists = await s3CustomerService.checkCustomerFolderExists(customer);
    if (!folderExists) {
      console.log('Customer folder does not exist, creating it...');
      await s3CustomerService.createCustomerFolder(customer);
    }

    // 3. Ladda upp dokumentet
    console.log('Uploading document to S3...');
    const documentUrl = await s3CustomerService.uploadCustomerDocument(
      customer,
      req.file,
      documentType
    );
    console.log('Successfully uploaded document to S3');

    // 4. Spara dokumentreferensen i databasen
    console.log('Saving document reference in database...');
    const document = await prisma.document.create({
      data: {
        customerId: id,
        type: documentType,
        url: documentUrl,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      }
    });
    console.log('Successfully saved document reference');

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to upload document', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// GET /customers
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch customers...');
    const customers = await prisma.customer.findMany({
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      },
    });
    console.log(`Successfully fetched ${customers.length} customers`);
    res.json(customers);
  } catch (error) {
    console.error('Detailed error fetching customers:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to fetch customers', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// GET /customers/:id
router.get('/:id', async (req, res) => {
  try {
    console.log(`Attempting to fetch customer with ID: ${req.params.id}`);
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      },
    });
    
    if (!customer) {
      console.log(`No customer found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    console.log('Successfully fetched customer details');
    res.json(customer);
  } catch (error) {
    console.error(`Error fetching customer ${req.params.id}:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to fetch customer', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// PUT /customers/:id
router.put('/:id', async (req, res) => {
  try {
    console.log(`Attempting to update customer ${req.params.id} with data:`, JSON.stringify(req.body, null, 2));
    
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        addresses: {
          deleteMany: {},
          create: req.body.addresses,
        },
        contacts: {
          deleteMany: {},
          create: req.body.contacts,
        },
        industry: req.body.industry ? {
          upsert: {
            create: req.body.industry,
            update: req.body.industry,
          },
        } : undefined,
      },
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      },
    });

    console.log('Successfully updated customer in database');

    // Uppdatera kundens loggfil i S3
    try {
      console.log('Updating customer log in S3...');
      await s3CustomerService.updateCustomerLog(customer);
      console.log('Successfully updated customer log in S3');
    } catch (s3Error) {
      console.error('Failed to update customer log in S3:', s3Error);
      // Fortsätt även om S3-uppdateringen misslyckas
    }

    res.json(customer);
  } catch (error) {
    console.error(`Error updating customer ${req.params.id}:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to update customer', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// DELETE /customers/:id
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete customer ${req.params.id}`);
    await prisma.customer.delete({
      where: { id: req.params.id },
    });
    console.log(`Successfully deleted customer ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting customer ${req.params.id}:`, error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Failed to delete customer', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
