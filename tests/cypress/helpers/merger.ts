import { mergeFiles } from 'junit-report-merger';
import * as fs from 'fs';
import * as path from 'path';

const reportsDir: string = path.join(__dirname, '../reports/junit');
const outputFile: string = path.join(reportsDir, 'final-results.xml');

const xmlFiles: string[] = fs.readdirSync(reportsDir)
  .filter((file: string) => file.endsWith('.xml') && file !== 'final-results.xml')
  .map((file: string) => path.join(reportsDir, file));

if (xmlFiles.length === 0) {
  console.error('No JUnit reports found to merge.');
  process.exit(1);
}

console.log(`Found ${xmlFiles.length} XML files to merge...`);

mergeFiles(outputFile, xmlFiles)
  .then(() => {
    console.log(`Reports successfully merged into: ${outputFile}`);
  })
  .catch((error: Error) => {
    console.error('Error merging reports:', error);
    process.exit(1);
  });