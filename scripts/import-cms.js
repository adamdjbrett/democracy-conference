import fs from 'fs';
import { parse } from 'csv-parse/sync';
import yaml from 'js-yaml';

async function importFromCsv() {
    const input = fs.readFileSync('Axcora_CMS.csv', 'utf8');
    const records = parse(input, { columns: true, delimiter: '\t', skip_empty_lines: true });

    const schedule = records.map(r => ({
        sort: r.sort,
        date: r.date,
        time: r.time,
        start: { date: r.start_date, time: r.start_time },
        end: { date: r.end_date, time: r.end_time },
        speaker: r.speakers.split(';').filter(s => s).map(s => {
            const [name, type] = s.split('|');
            return { name: name.trim(), type: type.trim() };
        }),
        title: r.title,
        description: r.description,
        content: r.content,
        list: r.list,
        article: r.article
    }));

    const finalYaml = yaml.dump({ schedule }, { lineWidth: -1, noRefs: true });
    fs.writeFileSync('./src/_data/event.yaml', finalYaml);
    console.log("🚀 YAML updated successfully from CSV!");
}

importFromCsv();