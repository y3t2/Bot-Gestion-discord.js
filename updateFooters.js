const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, 'src', 'commands');

function replaceFooterInFile(filePath) {
    let fileContent = fs.readFileSync(filePath, 'utf8');

    const updatedContent = fileContent.replace(/\.setFooter\({\s*text:\s*['"`](.*?)['"`]\s*}\)/g, '.setFooter({ text: \'• © ΛƁYSΣ-2024\' })');

    if (updatedContent !== fileContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Footer updated in: ${filePath}`);
    }
}

function replaceFootersInAllFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            replaceFootersInAllFiles(filePath); 
        } else if (file.endsWith('.js')) {
            replaceFooterInFile(filePath);
        }
    });
}

replaceFootersInAllFiles(commandsDir);
console.log('All footers replaced with "• © ΛƁYSΣ-2024".');
