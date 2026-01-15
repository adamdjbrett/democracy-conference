import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadYaml = (filePath) => {
    try {
        const fullPath = path.join(__dirname, filePath);
        if (!fs.existsSync(fullPath)) return null;
        return yaml.load(fs.readFileSync(fullPath, 'utf8'));
    } catch (e) {
        console.error(`❌ YAML Error [${filePath}]:`, e.message);
        return null;
    }
};

async function exportYamlToAxcoraCMS() {
    const workbook = new ExcelJS.Workbook();
    const events = loadYaml('./src/_data/event.yaml');
    const speakers = loadYaml('./src/_data/speakers.yaml');

    // --- CONFIGURATION ---
    const sheetsConfig = [
        {
            name: 'EVENTS',
            headers: ['sort', 'date', 'time', 'start.date', 'start.time', 'end.date', 'end.time', 'speaker', 'title', 'image', 'description', 'content', 'list', 'article'],
            color: 'FF0984E3',
            rawData: events?.schedule || []
        },
        {
            name: 'SPEAKERS',
            headers: ['name', 'id', 'sort', 'role', 'institution', 'img', 'bio', 'content', 'links'],
            color: 'FFE17055',
            rawData: speakers?.list || []
        }
    ];

    for (const config of sheetsConfig) {
        const ws = workbook.addWorksheet(config.name, { views: [{ showGridLines: false }] });

        // 1. SET HEADERS
        const headerRow = ws.getRow(1);
        config.headers.forEach((h, i) => {
            const cell = headerRow.getCell(i + 1);
            cell.value = h;
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: config.color } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            cell.alignment = { horizontal: 'center' };
        });
        headerRow.height = 30;

        config.rawData.forEach((item, rowIndex) => {
            const row = ws.getRow(rowIndex + 2);
            
            if (config.name === 'EVENTS') {
                const articleRaw = item.article || item.artilce || "";
                const cleanArticle = String(articleRaw).replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "");

                row.getCell(1).value = item.sort;
                row.getCell(2).value = item.date;
                row.getCell(3).value = item.time;
                row.getCell(4).value = item.start?.date;
                row.getCell(5).value = item.start?.time;
                row.getCell(6).value = item.end?.date;
                row.getCell(7).value = item.end?.time;
                row.getCell(8).value = item.speaker ? item.speaker.map(s => `${s.name}|${s.type}`).join(', ') : '';
                row.getCell(9).value = item.title;
                row.getCell(10).value = item.image;
                row.getCell(11).value = item.description;
                row.getCell(12).value = item.content;
                row.getCell(13).value = item.list;
                row.getCell(14).value = cleanArticle;
            } else {
                row.getCell(1).value = item.name;
                row.getCell(2).value = item.id;
                row.getCell(3).value = item.sort;
                row.getCell(4).value = item.role;
                row.getCell(5).value = item.institution;
                row.getCell(6).value = item.img;
                row.getCell(7).value = item.bio;
                row.getCell(8).value = item.content;
                row.getCell(9).value = item.links ? item.links.map(l => `${l.name}|${l.icon}|${l.url}`).join(', ') : '';
            }
            
            row.height = 150;
            row.commit(); 
        });

        ws.columns.forEach((col, i) => {
            col.width = (i >= 10) ? 70 : 25;
            col.alignment = { wrapText: true, vertical: 'top' };
        });
    }

    const filename = '11ty_WEBC_SPA.xlsx';
    await workbook.xlsx.writeFile(filename);
    console.log(`\n✅ TOTAL SYNC SUCCESS: ${filename}`);
}

exportYamlToAxcoraCMS().catch(console.error);