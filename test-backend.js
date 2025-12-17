// Quick test to check if backend dependencies are working
console.log('Testing backend setup...');

try {
    const express = require('./backend/node_modules/express');
    console.log('✓ Express loaded');
    
    const mongoose = require('./backend/node_modules/mongoose');
    console.log('✓ Mongoose loaded');
    
    const dotenv = require('./backend/node_modules/dotenv');
    console.log('✓ Dotenv loaded');
    
    console.log('\n✓ All backend dependencies are installed correctly!');
    console.log('\nBackend is ready to run.');
    console.log('MongoDB connection will be tested when you start the server.');
    
} catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
}

