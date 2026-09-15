from pathlib import Path
import json,re,unicodedata,hashlib,collections,bisect
import pdfplumber
from pypdf import PdfReader
import argparse,tempfile
parser=argparse.ArgumentParser(description="Import the supplied Civilsdaily PYQ editions and assign overlapping topic tags.")
parser.add_argument("--prelims",required=True,type=Path)
parser.add_argument("--mains",required=True,type=Path)
parser.add_argument("--output",type=Path,default=Path(__file__).resolve().parents[2]/"quartz/static/pyqs/questions.json")
args=parser.parse_args()
ROOT=Path(__file__).resolve().parent
scratch=tempfile.TemporaryDirectory(prefix='se7en-pyq-')
OUT=Path(scratch.name)

def clean(s):
    s=unicodedata.normalize('NFC',s or '').replace('\u00ad','').translate(str.maketrans({'ﬁ':'fi','ﬂ':'fl','ﬀ':'ff','ﬃ':'ffi','ﬄ':'ffl'}))
    s=re.sub(r'(\w)-\s*\n\s*(\w)',r'\1\2',s)
    s=re.sub(r'[ \t]+',' ',s)
    return s.strip()

def page_clean(s):
    lines=s.splitlines()
    return '\n'.join(l for l in lines if not re.search(r'Civilsdaily IAS, Ground Floor|Copyright ©|MICROTHEMES PRELIMS|MAINS MICROTHEMES|^Page \d+$|^GS 2013-2025$|^ESSAY PAPER|^\d{1,3}$',l.strip()))

pre_pages=[page.extract_text() or '' for page in PdfReader(args.prelims).pages]
main_pages=[page.extract_text() or '' for page in PdfReader(args.mains).pages]
pre_sections={4:'Polity',29:'Economy',57:'Geography',77:'Agriculture',86:'Modern History',101:'Environment',131:'International Relations',146:'Governance',160:'Art and Culture',179:'Science and Technology',202:'Miscellaneous',208:'Ethics'}
main_sections={6:('Art and Culture','GS I'),8:('Modern History','GS I'),10:('Post Independence','GS I'),11:('World History','GS I'),12:('Society','GS I'),17:('Geography','GS I'),26:('Polity','GS II'),35:('Governance','GS II'),41:('Social Justice','GS II'),44:('International Relations','GS II'),52:('Economy','GS III'),58:('Agriculture','GS III'),62:('Science and Technology','GS III'),66:('Environment','GS III'),68:('Disaster Management','GS III'),69:('Internal Security','GS III'),76:('Ethics','GS IV')}
records=[]; issues=[]
def add(stage,paper,year,text,subject,theme,pages,**extra):
    text=clean(text)
    r=dict(stage=stage,paper=paper,year=int(year),text=text,subject=subject,microthemes=[clean(theme)] if theme else [],sourcePages=sorted(set(pages)),**extra)
    if not (2008<=r['year']<=2026 if stage=='Prelims' else 2013<=r['year']<=2025):
        raise ValueError(r)
    records.append(r)

subject=None; theme=''; current=None

def finish_pre():
    global current
    if not current:return
    body=page_clean('\n'.join(current['parts']))
    answer=re.search(r'Ans\s*:\s*(.*)',body)
    flags=[]
    if answer:
        key=clean(answer.group(1)).split('\n')[0]
        body=body[:answer.start()].strip()
    else:key=''; flags.append('The supplied entry has no answer key.')
    body=body.replace('only’(c)', 'only\n(c)')
    matches=list(re.finditer(r'(?:^|\n)\s*\(?([a-dA-D])\)\s*',body))
    options=[]
    if len(matches)==8 and ''.join(m.group(1).lower() for m in matches)=='abcdabcd':
        first=[clean(body[matches[i].end():matches[i+1].start()]) for i in range(4)]
        second=[clean(body[matches[i].end():matches[i+1].start() if i<7 else len(body)]) for i in range(4,8)]
        if first==second:
            body=body[:matches[4].start()]
            matches=matches[:4]
    if len(matches)==4 and ''.join(m.group(1).lower() for m in matches)=='abcd':
        for i,m in enumerate(matches):
            options.append(clean(body[m.end():matches[i+1].start() if i<3 else len(body)]))
        stem=body[:matches[0].start()]
    else:
        stem=body; flags.append('Check the option formatting against the source.')
    if re.fullmatch(r'\(?[a-dA-D]\)?[.*]?',key or ''):key=key.strip('().*').upper()
    else:key=None
    if not key and not flags:flags.append('No answer is supplied in the compilation.')
    if options and all(re.fullmatch(r'[\d\W]+|(?i:.*\b(?:only|both|neither|nor|and)\b.*)', o) for o in options) and not re.search(r'\d|\bI\b', stem):
        flags.append('The source may be missing the statements referred to by its options.')
    add('Prelims','GS',current['year'],stem,current['subject'],current['theme'],current['pages'],options=options,answer=key,sourceNumber=current['number'],flags=flags)
    current=None

for page_no,s in enumerate(pre_pages,1):
    if page_no in pre_sections:
        finish_pre();subject=pre_sections[page_no];theme='';continue
    if subject is None or page_no==210:continue
    s=page_clean(s)
    events=list(re.finditer(r'\[Microtheme\]|(?m:^\s*(\d+)\.\s*\[(\d{4})\])',s))
    if not events and current:
        current['parts'].append(s);current['pages'].append(page_no);continue
    if current and events:
        current['parts'].append(s[:events[0].start()])
        if s[:events[0].start()].strip():current['pages'].append(page_no)
    for i,e in enumerate(events):
        finish_pre()
        part=s[e.end():events[i+1].start() if i+1<len(events) else len(s)]
        if e.group(0)=='[Microtheme]':theme=clean(part)
        else:current=dict(number=int(e.group(1)),year=int(e.group(2)),subject=subject,theme=theme,parts=[part],pages=[page_no])
finish_pre()
assert len(records)==1994, len(records)
print('Prelims',len(records),flush=True)

pdf=pdfplumber.open(args.mains)
subject=paper=None;theme='';table_rows=0
for page_no in range(6,91):
    if page_no in main_sections:subject,paper=main_sections[page_no];theme=''
    if not subject:continue
    if page_no in [74,75]:continue
    for table in pdf.pages[page_no-1].extract_tables():
        for row in table:
            if len(row)!=4:continue
            raw_theme,text,year,marks=row
            if year and re.fullmatch(r'20\d{2}',year.strip()):
                theme=clean(raw_theme) if raw_theme else theme
                if not text or len(text.strip())<10:issues.append(dict(page=page_no,row=row));continue
                mark=clean(marks)
                add('Mains',paper,year,text,subject,theme,[page_no],marks=float(mark) if re.fullmatch(r'\d+(?:\.\d+)?',mark) else None)
                table_rows+=1
            elif text and re.search(r'20\d{2}',year or ''):issues.append(dict(page=page_no,row=row))
print('Mains table rows',table_rows, 'issues',len(issues),flush=True)

# Case studies are a two-column section, with explicit year and marks after each question.
parts=[];offsets=[];pos=0
for page_no in range(91,114):
    s=page_clean(main_pages[page_no-1])
    s=re.sub(r'UPSC MAINS 20\d{2}|^Case Studies\nEthics\n','',s)
    offsets.append((pos,page_no));parts.append(s);pos+=len(s)+1
joined='\n'.join(parts)
case_matches=list(re.finditer(r'\[Case Study (\d+)\]',joined))
for i,m in enumerate(case_matches):
    end=case_matches[i+1].start() if i+1<len(case_matches) else len(joined)
    body=joined[m.end():end]
    meta=re.search(r'\[UPSC\s*(20\d{2})\s*,\s*(\d+)\s*Marks\]',body)
    if not meta:issues.append(dict(case=i,body=body[:200]));continue
    theme_match=re.search(r'Theme\s*:\s*(.*)',body[meta.end():],re.S)
    theme=clean(theme_match.group(1)) if theme_match else 'Ethics case studies'
    pages=[n for off,n in offsets if off<end and (off+len(parts[n-91])+1)>m.start()]
    add('Mains','GS IV',meta.group(1),body[:meta.start()],'Ethics',theme,pages,marks=float(meta.group(2)),kind='Case study',sourceNumber=int(m.group(1)))
print('Case studies',len(case_matches),flush=True)

parts=[];offsets=[];pos=0
for page_no in range(116,122):
    s=page_clean(main_pages[page_no-1]);offsets.append((pos,page_no));parts.append(s);pos+=len(s)+1
joined='\n'.join(parts)
# Global question numbers 01-40 are stable across the five year blocks.
pat=re.compile(r'(?m)^\s*(\d{2})\s+(.+?)(?=\n(?:Philosophical|Proverb\s*/\s*Maxim|Thematic))',re.S)
essays=list(pat.finditer(joined))
for i,m in enumerate(essays):
    n=int(m.group(1));year=2021+(n-1)//8
    end=essays[i+1].start() if i+1<len(essays) else len(joined)
    mt=re.search(r'Microtheme:\s*([^\n●]+)',joined[m.end():end])
    page=max(npage for off,npage in offsets if off<=m.start())
    add('Mains','Essay',year,m.group(2),'Essay',mt.group(1) if mt else '',[page],kind='Essay')
print('Essays',len(essays),flush=True)
assert len(essays)==40

# Stable identity is based on exam, year, paper and normalized question; cross-listed copies merge.
by_key={};dupes=[]
for r in records:
    key=r['stage']+r['paper']+str(r['year'])+re.sub(r'\W','',(r['text']+'|'.join(r.get('options',[]))).lower())
    r['id']=r['stage'].lower()+'-'+str(r['year'])+'-'+hashlib.sha256(key.encode()).hexdigest()[:12]
    if key in by_key:
        old=by_key[key]; old['microthemes']=sorted(set(old['microthemes']+r['microthemes']));old['sourcePages']=sorted(set(old['sourcePages']+r['sourcePages']));dupes.append(r['id'])
    else:by_key[key]=r
records=list(by_key.values())
(OUT/'questions.raw.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
(OUT/'extraction-report.json').write_text(json.dumps(dict(total=len(records),duplicates=dupes,issues=issues,yearCounts={stage:dict(sorted(collections.Counter(r['year'] for r in records if r['stage']==stage).items())) for stage in ['Prelims','Mains']},flags=[{'id':r['id'],'page':r['sourcePages'],'flags':r['flags'],'text':r['text'][:120]} for r in records if r.get('flags')]),ensure_ascii=False,indent=2))
print('Total',len(records),'duplicates',len(dupes),'flags',sum(bool(r.get('flags')) for r in records),'issues',len(issues))

from pathlib import Path
import json,re,unicodedata,collections
ROOT=Path(__file__).resolve().parent

def normal(s):
 s=unicodedata.normalize('NFKD',s).lower()
 s=''.join(c for c in s if not unicodedata.combining(c))
 return re.sub(r'[^a-z0-9]+',' ',s).strip()

def slug(s):return normal(s).replace(' ','-')
rows=[]
for line in (ROOT/'taxonomy.tsv').read_text().splitlines():
 label,groups,*aliases=line.split('|')
 aliases=list(dict.fromkeys([label,*aliases]))
 rows.append(dict(id=slug(label),label=label,subjects=groups.split(','),aliases=aliases))
qs=records
for r in qs:
 # Tag the question itself; answer distractors must not assign irrelevant topics.
 text=' '+normal(r['text'])+' '
 tags=[]
 for t in rows:
  if t['id'] in ['knowledge-and-wisdom','happiness-and-contentment','justice-and-power','science-and-society'] and r['paper'] not in ['Essay','GS IV']:continue
  aliases=t['aliases']
  if t['id']=='maps-and-locations' and r['subject']!='Geography':aliases=['latitude','longitude','strait','straits','island','islands']
  if any(' '+normal(a)+' ' in text for a in aliases):tags.append(t)
 # Specific source microthemes supplement vocabulary gaps. Broad compound themes
 # remain separately searchable, without tagging every question with all their topics.
 themes=[normal(x) for x in r['microthemes']]
 for t in rows:
  if t not in tags and any(x==normal(a) for x in themes for a in t['aliases']):tags.append(t)
 if any(t['id']=='forests' for t in tags) and any(t['id']=='tribal-rights' for t in tags) and any(word in text for word in ['right','livelihood','communit']):
  topic=next(t for t in rows if t['id']=='forest-rights')
  if topic not in tags:tags.append(topic)
 r['topics']=[t['id'] for t in tags]
 # Essay-oriented abstract tags must not turn every GS question into an Essay subject.
 r['subjects']=list(dict.fromkeys([r['subject']]+[s for t in tags for s in t['subjects'] if s!='Essay' or r['paper']=='Essay']))
 r['microthemes']=[re.sub(r'\s+',' ',s) for s in r['microthemes']]
 r['flags']=[f for f in r.get('flags',[]) if 'missing the statements' not in f or r['sourcePages'][0] in [11,104,148]]
 r['text']=r['text']
 # Preserve paragraph/statement boundaries while unwrapping typeset PDF prose.
 def unwrap(s):
  s=re.sub(r'\n(?=\s*(?:[0-9IVX]+[.)]|\([a-z]\))\s*)','\v',s)
  s=re.sub(r'\n\s*\n','\v',s)
  return re.sub(r'[ \t]+',' ',s.replace('\n',' ')).replace('\v','\n').strip()
 r['text']=unwrap(r['text'])
 if r.get('options'):r['options']=[unwrap(o) for o in r['options']]
 # Source editions contain known gaps; flag plainly without inventing missing text.
 if any('option formatting' in f for f in r.get('flags',[])):
  r['flags']=['The source prints multiple or inconsistent option sets. Check the original paper.']

out=args.output.parent
out.mkdir(parents=True,exist_ok=True)
source_info=[dict(id='prelims',name='Civilsdaily Prelims Microthemes (2008–2026)',years='2008–2026',papers='Prelims GS',pages=210),dict(id='mains',name='Civilsdaily GS Mains Microthemes, 2026 edition',years='GS 2013–2025; Essay 2021–2025',papers='GS I–IV, ethics case studies and Essay',pages=122)]
obj=dict(version=1,updated='2026-09-15',sources=source_info,topics=rows,questions=qs)
(args.output).write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':')))
print('Questions',len(qs),'topics',len(rows),'multi-topic',sum(len(r['topics'])>1 for r in qs),'without detailed topic',sum(not r['topics'] for r in qs),'size', (args.output).stat().st_size)
for term in ['forest-rights','fundamental-rights','tribal-rights']:
 matches=[r for r in qs if term in r['topics']]
 print(term,len(matches),[(r['year'],r['paper'],r['sourcePages']) for r in matches[:4]])

scratch.cleanup()
