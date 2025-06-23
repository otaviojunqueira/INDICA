import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Diretórios a serem verificados
const directories = [
  './src/pages',
  './src/components'
];

// Obter o diretório atual (para ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para procurar arquivos recursivamente
function findFiles(dir, ext, fileList = []) {
  const fullPath = path.join(__dirname, dir);
  
  try {
    const files = fs.readdirSync(fullPath);
    
    files.forEach(file => {
      const filePath = path.join(fullPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findFiles(path.join(dir, file), ext, fileList);
      } else if (path.extname(file) === ext) {
        fileList.push(filePath);
      }
    });
  } catch (err) {
    console.error(`Erro ao ler diretório ${fullPath}:`, err);
  }
  
  return fileList;
}

// Função para corrigir o arquivo
function fixExports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar se o arquivo já tem export default
    if (content.includes('export default ')) {
      console.log(`✅ ${path.relative(__dirname, filePath)} - já tem export default`);
      return;
    }
    
    // Procurar por export const Component
    const matches = content.match(/export const (\w+)(\s*:\s*React\.FC(?:<.*>)?| = )/);
    if (matches) {
      const componentName = matches[1];
      
      // Substituir 'export const Component' por 'const Component'
      let newContent = content.replace(
        new RegExp(`export const ${componentName}(\\s*:\\s*React\\.FC(?:<.*>)?| = )`, 'g'),
        `const ${componentName}$1`
      );
      
        // Adicionar export default no final do arquivo
      // Verificar primeiro se o arquivo já não termina com uma linha em branco
      if (!newContent.endsWith('\n')) {
        newContent += '\n';
      }
      
      newContent += `\nexport default ${componentName};`;
      
      fs.writeFileSync(filePath, newContent);
      console.log(`🔧 ${path.relative(__dirname, filePath)} - convertido export const para export default`);
    } else {
      console.log(`❓ ${path.relative(__dirname, filePath)} - não encontrado padrão de exportação conhecido`);
    }
  } catch (err) {
    console.error(`Erro ao processar arquivo ${filePath}:`, err);
  }
}

// Encontrar todos os arquivos .tsx
let allFiles = [];
directories.forEach(dir => {
  const files = findFiles(dir, '.tsx');
  allFiles = allFiles.concat(files);
});

// Corrigir exportações em todos os arquivos
console.log(`\nAnalisando ${allFiles.length} arquivos para corrigir exportações...\n`);
allFiles.forEach(file => {
  fixExports(file);
});

console.log('\nProcesso concluído!'); 