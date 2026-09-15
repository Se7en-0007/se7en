# PYQ library maintenance

The live collection is `quartz/static/pyqs/questions.json`. It is loaded only when the PYQ page opens. The PDFs themselves are not published or committed. The page is generated from `quartz/plugins/pageTypes/pyq.ts`; no files are written into the linked Obsidian vault.

## Sources and coverage

- Civilsdaily Prelims Microthemes 2008–2026: 1,994 GS questions.
- Civilsdaily GS Mains Microthemes 2026 edition: 974 GS theory entries, 78 ethics case studies, 40 essays.
- GS coverage: 2013–2025. Essays: 2021–2025. No CSAT or optional papers in these inputs.

Counts describe the supplied compilations, not independently verified completeness of official UPSC papers. Source page references are retained. Source serial numbers are not presented as original UPSC question numbers. Seven entries contain missing statements or conflicting option sets and are flagged. Seven more lack a supplied answer key. Keys are labelled as compilation answers, not official verified answers.

## Topic assignments

`taxonomy.tsv` contains `label|comma-separated subjects|alias|alias...`. The importer tags question stems and exact source microthemes; it does not assign topics merely from answer distractors. Questions retain the original microthemes separately. Specific compound rules also connect forests, tribal rights and community livelihoods. Abstract essay tags are restricted to essays and ethics papers. Each record supports many topic IDs and many subjects.

Search covers question text, options, original microthemes, topic labels and aliases. Filters use the record's full subject/topic arrays. Words are matched conjunctively with prefixes and limited one-character typo tolerance. A question can appear under multiple filters without duplicate cards. Repeated source copies are merged only when exam, year, paper, question and options agree.

These are curated rule-based tags, not a claim of exhaustive human-reviewed semantic classification. Refine aliases or add a specific rule when a relevant question is missed; keep distractor-only topics out.

## Reimport these editions

Requires Python with `pypdf` and `pdfplumber`. Pass local PDF paths; originals stay local:

```sh
python3 scripts/pyq/import.py --prelims '/path/to/Prelims.pdf' --mains '/path/to/Mains.pdf'
node --import tsx --test quartz/util/pyq.test.ts
npx quartz build
```

The importer has coverage assertions for these exact editions. Adapt and inspect it before importing a different layout/edition. Preserve Unicode maths and source wording; do not silently fill missing statements or infer answer keys. Update coverage labels when adding new source papers. For a change to the bank format, increment its version and update the loader and tests together.
