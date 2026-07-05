#!/usr/bin/env python3
"""
Process interview .docx files: extract Q&A, remove smalltalk, 
save as Markdown files to content/interviews/
"""

import os
import re
from pathlib import Path
from docx import Document
import string

INTERVIEWS_DIR = Path('/Users/jonathan/Documents/Praktikum App/Interviews')
OUTPUT_DIR = Path('/Users/jonathan/Documents/Praktikum App/content/interviews')

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SMALLTALK_KEYWORDS = [
    'wie geht es', 'wie geht dir', 'wie war dein', 'wie war deine',
    'schön dich', 'freut mich', 'danke dir', 'danke für', 'gerne',
    'alles klar', 'bis dann', 'tschüss', 'auf wiedersehen', 'bye',
    'kaffee', 'wetter', 'wochenende', 'feierabend', 'sport', 'hobby',
    'freizeit', 'urlaub', 'kino', 'restaurant', 'musik', 'film',
    'essen', 'trinken', 'lustig', 'haha', 'lacht', 'lachen'
]

def normalize_filename(text):
    """Convert text to valid filename."""
    text = text.lower().strip()[:50]
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')

def extract_text_from_docx(filepath):
    """Extract all text from a .docx file."""
    doc = Document(filepath)
    return '\n'.join([p.text for p in doc.paragraphs if p.text.strip()])

def is_smalltalk(text):
    """Check if text is likely smalltalk."""
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in SMALLTALK_KEYWORDS)

def extract_qna(text):
    """Extract questions and answers from interview text."""
    lines = text.split('\n')
    qa_pairs = []
    current_q = None
    current_a = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Detect question markers
        if re.match(r'^([FfQq]:?\s*|F\.|Q\.|Frage|Question|\d+\.|.*\?$)', line):
            # Save previous Q&A if exists
            if current_q and current_a:
                qa_text = '\n'.join(current_a).strip()
                if not is_smalltalk(current_q) and not is_smalltalk(qa_text):
                    qa_pairs.append((current_q, qa_text))
            
            current_q = line.lstrip('FfQq:').strip()
            current_a = []
        
        # Detect answer markers
        elif re.match(r'^([AaAn]:?\s*|A\.|Answer|\-\s|•\s)', line):
            if current_q:
                current_a.append(line.lstrip('AaAn:').lstrip('-').lstrip('•').strip())
        
        # Continuation of answer
        elif current_q and not line.startswith('-') and not line.startswith('•'):
            if current_a or not re.match(r'^[A-Z]', line):  # not a new speaker
                current_a.append(line)
    
    # Save last Q&A
    if current_q and current_a:
        qa_text = '\n'.join(current_a).strip()
        if not is_smalltalk(current_q) and not is_smalltalk(qa_text):
            qa_pairs.append((current_q, qa_text))
    
    return qa_pairs

def save_interview_markdown(filename, qa_pairs):
    """Save Q&A pairs as a Markdown interview file."""
    if not qa_pairs:
        return None
    
    # Generate title from filename
    title = filename.replace('.docx', '').replace('_', ' ').strip()
    
    # Create normalized output filename
    output_filename = normalize_filename(title) + '.md'
    output_path = OUTPUT_DIR / output_filename
    
    # Build markdown content
    md_content = f"""---
title: "{title}"
date: 2026-06-20
summary: "Interview"
---

"""
    
    for i, (question, answer) in enumerate(qa_pairs, 1):
        md_content += f"**F: {question}**\n\n"
        md_content += f"{answer}\n\n"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    return output_path

def main():
    """Process all .docx files in the Interviews folder."""
    if not INTERVIEWS_DIR.exists():
        print(f"❌ Interviews directory not found: {INTERVIEWS_DIR}")
        return
    
    docx_files = list(INTERVIEWS_DIR.glob('*.docx'))
    print(f"📄 Found {len(docx_files)} interview files")
    
    processed = 0
    for docx_file in docx_files:
        print(f"\n📖 Processing: {docx_file.name}")
        
        try:
            # Extract text
            full_text = extract_text_from_docx(docx_file)
            
            # Extract Q&A pairs
            qa_pairs = extract_qna(full_text)
            
            if qa_pairs:
                # Save as Markdown
                output_path = save_interview_markdown(docx_file.stem, qa_pairs)
                if output_path:
                    print(f"   ✅ Saved: {output_path.name} ({len(qa_pairs)} Q&A pairs)")
                    processed += 1
            else:
                print(f"   ⚠️  No Q&A pairs found")
        
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print(f"\n✨ Processed {processed}/{len(docx_files)} interviews")

if __name__ == '__main__':
    main()
