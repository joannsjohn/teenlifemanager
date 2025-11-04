const fs = require('fs');
const path = require('path');

// Convert images to base64
const convertImageToBase64 = (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64String = imageBuffer.toString('base64');
    const mimeType = path.extname(imagePath).toLowerCase() === '.jpg' ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error converting ${imagePath}:`, error.message);
    return null;
  }
};

// Convert your images
const images = [
  { path: './assets/pc1.JPG', name: 'pc1' },
  { path: './assets/pic2.JPG', name: 'pic2' },
  { path: './assets/IMG_E2607.JPG', name: 'IMG_E2607' }
];

console.log('Converting images to base64...');
images.forEach(img => {
  const base64 = convertImageToBase64(img.path);
  if (base64) {
    console.log(`\n// ${img.name}:`);
    console.log(`const ${img.name} = '${base64.substring(0, 100)}...';`);
  }
});

