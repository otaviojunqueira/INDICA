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

// Função para corrigir as importações em um arquivo
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Encontrar todas as importações nomeadas de arquivos locais
    const importRegex = /import\s*{\s*([A-Za-z0-9_]+)\s*}\s*from\s*['"](\.{1,2}\/[^'"]+)['"]/g;
    let match;
    let modified = false;
    
    // Array para armazenar as importações a serem verificadas
    const importsToCheck = [];
    
    while ((match = importRegex.exec(content)) !== null) {
      const componentName = match[1];
      const importPath = match[2];
      
      // Verificar apenas importações de componentes locais (não bibliotecas)
      if (importPath.startsWith('.')) {
        importsToCheck.push({ componentName, importPath, fullMatch: match[0] });
      }
    }
    
    // Para cada importação, verificar se o arquivo de destino usa export default
    for (const { componentName, importPath, fullMatch } of importsToCheck) {
      // Resolver o caminho completo do arquivo importado
      const currentDir = path.dirname(filePath);
      let targetPath;
      
      // Resolver caminhos relativos
      if (importPath.endsWith('.tsx') || importPath.endsWith('.ts')) {
        targetPath = path.resolve(currentDir, importPath);
      } else {
        targetPath = path.resolve(currentDir, `${importPath}.tsx`);
        if (!fs.existsSync(targetPath)) {
          targetPath = path.resolve(currentDir, `${importPath}.ts`);
          if (!fs.existsSync(targetPath)) {
            continue; // Pular se o arquivo não existir
          }
        }
      }
      
      // Verificar se o arquivo existe
      if (fs.existsSync(targetPath)) {
        const targetContent = fs.readFileSync(targetPath, 'utf8');
        
        // Verificar se o arquivo usa export default
        if (targetContent.includes(`export default ${componentName}`) || 
            targetContent.includes(`export default function ${componentName}`) ||
            targetContent.includes(`export default class ${componentName}`)) {
          // Substituir a importação nomeada por importação default
          const newImport = `import ${componentName} from '${importPath}'`;
          content = content.replace(fullMatch, newImport);
          modified = true;
          
          console.log(`🔄 ${path.relative(__dirname, filePath)}: ${fullMatch} -> ${newImport}`);
        }
      }
    }
    
    // Salvar o arquivo se foi modificado
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ ${path.relative(__dirname, filePath)} - importações corrigidas`);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(`Erro ao processar arquivo ${filePath}:`, err);
    return false;
  }
}

// Encontrar todos os arquivos .tsx e .ts
let allFiles = [];
directories.forEach(dir => {
  allFiles = allFiles.concat(findFiles(dir, '.tsx'));
  allFiles = allFiles.concat(findFiles(dir, '.ts'));
});

// Corrigir importações em todos os arquivos
console.log(`\nAnalisando ${allFiles.length} arquivos para corrigir importações...\n`);

let modifiedCount = 0;
allFiles.forEach(file => {
  if (fixImports(file)) {
    modifiedCount++;
  }
});

console.log(`\nProcesso concluído! ${modifiedCount} arquivos foram modificados.`); 