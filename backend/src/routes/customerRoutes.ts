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

    try {
      // 2. Skapa kundens mapp och loggfil i S3
      await s3CustomerService.createCustomerFolder(customer);
    } catch (s3Error) {
      // Om S3-operationen misslyckas, ta bort kunden från databasen
      await prisma.customer.delete({ where: { id: customer.id } });
      throw s3Error;
    }

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// POST /customers/:id/documents - Ladda upp dokument för en kund
router.post('/:id/documents', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Hämta kunden
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // 2. Kontrollera att kundens S3-mapp existerar
    const folderExists = await s3CustomerService.checkCustomerFolderExists(customer);
    if (!folderExists) {
      await s3CustomerService.createCustomerFolder(customer);
    }

    // 3. Ladda upp dokumentet
    const documentUrl = await s3CustomerService.uploadCustomerDocument(
      customer,
      req.file,
      documentType
    );

    // 4. Spara dokumentreferensen i databasen
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

    res.status(201).json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// GET /customers
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      },
    });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /customers/:id
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        addresses: true,
        contacts: true,
        industry: true,
      },
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// PUT /customers/:id
router.put('/:id', async (req, res) => {
  try {
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

    // Uppdatera kundens loggfil i S3
    try {
      await s3CustomerService.updateCustomerLog(customer);
    } catch (s3Error) {
      console.error('Failed to update customer log in S3:', s3Error);
      // Fortsätt även om S3-uppdateringen misslyckas
    }

    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /customers/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
