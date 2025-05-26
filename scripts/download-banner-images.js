import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1920',
    filename: 'professionals.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&q=80&w=1920',
    filename: 'promotions.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1920',
    filename: 'partner.jpg'
  }
];

const downloadImage = (url, filename) => {
  const filepath = path.join(__dirname, '../public/images/banners', filename);
  const file = fs.createWriteStream(filepath);

  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filepath, () => {});
    console.error(`Error downloading ${filename}:`, err.message);
  });
};

// Create directory if it doesn't exist
const dir = path.join(__dirname, '../public/images/banners');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Download all images
images.forEach(image => {
  downloadImage(image.url, image.filename);
}); 