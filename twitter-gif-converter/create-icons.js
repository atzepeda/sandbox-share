const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#1da1f2';
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = 'white';
  ctx.font = `${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GIF', size / 2, size / 2);
  
  return canvas.toBuffer('image/png');
}

[16, 48, 128].forEach(size => {
  const buffer = createIcon(size);
  fs.writeFileSync(`icon-${size}.png`, buffer);
  console.log(`Created icon-${size}.png`);
});