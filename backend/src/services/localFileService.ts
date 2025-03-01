import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { UploadedFile } from '../types/file';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Skapa uploads-mappen om den inte finns
const initializeUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Initialisera vid start
initializeUploadDir();

export const localFileService = {
  async uploadFile(file: Express.Multer.File): Promise<UploadedFile> {
    const fileExtension = path.extname(file.originalname);
    const randomString = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomString}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Spara filen
    await fs.writeFile(filePath, file.buffer);

    // Returnera filinfo
    return {
      key: fileName,
      url: `/api/uploads/${fileName}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };
  },

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, key);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  },

  async getFilePath(key: string): Promise<string> {
    const filePath = path.join(UPLOAD_DIR, key);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      throw new Error('File not found');
    }
  },
};
