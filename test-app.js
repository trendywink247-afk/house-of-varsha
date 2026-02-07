#!/usr/bin/env node

/**
 * Simple test script to verify the House of Varsha application structure
 * Run this script to check for common issues before starting the development server
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 House of Varsha Application Test\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.ts',
  'app/page.tsx',
  'app/layout.tsx',
  'components/Header.tsx',
  'components/Footer.tsx',
  'lib/data.ts',
  'lib/googleSheets.ts',
  'lib/cloudinary.ts',
  'data/products.ts'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check package.json for required dependencies
console.log('\n📦 Checking package.json...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'tailwindcss',
    'cloudinary',
    'googleapis'
  ];

  const missingDeps = [];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      console.log(`  ✅ ${dep}`);
    } else {
      console.log(`  ❌ ${dep} - MISSING`);
      missingDeps.push(dep);
    }
  });

  if (missingDeps.length === 0) {
    console.log('  🎉 All required dependencies found!');
  }
} else {
  console.log('  ❌ package.json not found');
  allFilesExist = false;
}

// Check for environment file
console.log('\n🔧 Checking environment configuration...');
if (fs.existsSync('.env.local')) {
  console.log('  ✅ .env.local exists');
} else if (fs.existsSync('.env.example')) {
  console.log('  ⚠️  .env.local not found, but .env.example exists');
  console.log('  💡 Copy .env.example to .env.local and configure your settings');
} else {
  console.log('  ⚠️  No environment file found');
  console.log('  💡 Create .env.local or copy from .env.example');
}

// Check TypeScript configuration
console.log('\n⚙️  Checking TypeScript configuration...');
if (fs.existsSync('tsconfig.json')) {
  console.log('  ✅ tsconfig.json exists');
} else {
  console.log('  ⚠️  tsconfig.json not found');
}

// Check for node_modules
console.log('\n📦 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('  ✅ node_modules exists (dependencies installed)');
} else {
  console.log('  ⚠️  node_modules not found');
  console.log('  💡 Run: npm install');
}

// Summary
console.log('\n📊 Test Summary:');
if (allFilesExist) {
  console.log('  🎉 All critical files are present!');
  console.log('\n🚀 Ready to start the application:');
  console.log('   npm run dev');
} else {
  console.log('  ⚠️  Some files are missing. Please check the errors above.');
}

console.log('\n📖 For detailed setup instructions, see README.md');