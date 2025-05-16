// Script to add React import to all TypeScript/TSX files that don't already have it
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'app/src');

// Function to recursively find all .tsx and .ts files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to add React import if it doesn't exist
function addReactImport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const hasReactImport = /import\s+React\b/.test(content);
    
    if (!hasReactImport) {
      // Check if there's an existing import from 'react'
      const hasReactModuleImport = /import\s+.*\s+from\s+['"]react['"]/.test(content);
      
      if (hasReactModuleImport) {
        // Update existing react import to include React
        content = content.replace(
          /import\s+{(.*)}\s+from\s+['"]react['"];?/,
          (match, imports) => {
            // Don't add React if it's already there
            if (imports.includes('React')) {
              return match;
            }
            return `import React, { ${imports} } from 'react';`;
          }
        );
      } else {
        // Add new import at the top of the file
        content = `import React from 'react';\n${content}`;
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added React import to ${path.relative(__dirname, filePath)}`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
    return false;
  }
}

// Find all TSX files and add React import
const tsxFiles = findTsxFiles(directoryPath);
let updatedCount = 0;

tsxFiles.forEach(file => {
  if (addReactImport(file)) {
    updatedCount++;
  }
});

console.log(`\nCompleted! Updated ${updatedCount} of ${tsxFiles.length} files.`);
