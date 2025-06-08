const fs = require('fs');
const path = require('path');

// Create a simple 200x200 PNG with a transparent background
const width = 200;
const height = 200;
const buffer = Buffer.alloc(width * height * 4); // 4 bytes per pixel (RGBA)

// Fill with transparent pixels
for (let i = 0; i < buffer.length; i += 4) {
    // R, G, B, A
    buffer[i] = 200;     // Red
    buffer[i + 1] = 200; // Green
    buffer[i + 2] = 200; // Blue
    buffer[i + 3] = 255; // Alpha (fully opaque)
}

// Create the PNG header
const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, width >> 8, width & 255,
    0x00, 0x00, 0x00, height >> 8, height & 255,
    0x08, 0x06, 0x00, 0x00, 0x00
]);

// Write the PNG file
fs.writeFileSync(
    path.join(__dirname, '..', 'images', 'default-avatar.png'),
    Buffer.concat([header, buffer])
);
