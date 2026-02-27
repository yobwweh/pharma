const { execSync } = require('child_process');
const fs = require('fs');
try {
    const result = execSync('npx prisma validate', { stdio: 'pipe' });
    fs.writeFileSync('prisma_error.txt', result.toString());
} catch (error) {
    fs.writeFileSync('prisma_error.txt', error.output ? error.output.toString() : error.message);
}
