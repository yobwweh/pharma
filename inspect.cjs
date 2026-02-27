const { execSync } = require('child_process');
const fs = require('fs');
try {
    const result = execSync('npx prisma validate', { stdio: 'pipe' });
    fs.writeFileSync('prisma_error.txt', result.toString());
} catch (error) {
    let out = error.message;
    if (error.output) out += '\n' + error.output.toString();
    fs.writeFileSync('prisma_error.txt', out);
}
