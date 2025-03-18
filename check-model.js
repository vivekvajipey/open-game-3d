// This is a simple utility script to check if the model file exists
// Run this with: node check-model.js

const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, 'assets', 'models', 'runner.glb');

console.log('Checking for model at path:', modelPath);

try {
    if (fs.existsSync(modelPath)) {
        const stats = fs.statSync(modelPath);
        console.log('✅ Model file exists!');
        console.log(`File size: ${Math.round(stats.size / 1024)} KB`);
        console.log(`Last modified: ${stats.mtime}`);
    } else {
        console.error('❌ Model file does not exist at the specified path!');
        console.log('Please ensure the runner.glb file is in the assets/models directory.');
    }
} catch (err) {
    console.error('Error checking for model file:', err);
}

// Also check for the existence of the assets/models directory
const modelsDir = path.join(__dirname, 'assets', 'models');
try {
    if (fs.existsSync(modelsDir)) {
        console.log('✅ Models directory exists!');
        // List files in the models directory
        const files = fs.readdirSync(modelsDir);
        console.log('Files in models directory:', files);
    } else {
        console.error('❌ Models directory does not exist!');
        console.log('Please create the directory: assets/models');
    }
} catch (err) {
    console.error('Error checking models directory:', err);
} 