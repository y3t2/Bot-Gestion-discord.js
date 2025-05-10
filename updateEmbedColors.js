const fs = require('fs');
const path = require('path');


const commandsDir = path.join(__dirname, 'src', 'commands');

function replaceEmbedColorInFile(filePath) {
  
    let fileContent = fs.readFileSync(filePath, 'utf8');

   
    const updatedContent = fileContent.replace(/\.setColor\(['"`](.*?)['"`]\)/g, '.setColor(\'#4B0082\')');

   
    if (updatedContent !== fileContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Embed color updated in: ${filePath}`);
    }
}

function replaceEmbedColorsInAllFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);

       
        if (fs.statSync(filePath).isDirectory()) {
            replaceEmbedColorsInAllFiles(filePath); 
        } else if (file.endsWith('.js')) {
           
            replaceEmbedColorInFile(filePath);
        }
    });
}


replaceEmbedColorsInAllFiles(commandsDir);
console.log('All embed colors replaced with "#4B0082".');
