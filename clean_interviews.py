#!/usr/bin/env python3
"""
Clean and rewrite interview transcripts:
- Remove filler words and stutters
- Fix grammar and spelling
- Restructure for clarity
"""

import re
from pathlib import Path

INTERVIEWS_DIR = Path('/Users/jonathan/Documents/Praktikum App/content/interviews')

def clean_text(text):
    """Remove filler words and fix common transcription errors."""
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    # Remove speaker names and timestamps
    text = re.sub(r'^(Jonathan|Ellen|[A-Z]\w+\s+\d+:\d+\s*\n?)', '', text, flags=re.MULTILINE)
    text = re.sub(r'\n[A-Z]\w+\s+\d+:\d+', '', text)
    text = re.sub(r'\n\s*Jonathan.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'\n\s*Ellen.*$', '', text, flags=re.MULTILINE)
    
    # Remove exact word repetitions (word word → word)
    words_to_clean = ['da', 'dass', 'ein', 'und', 'aber']
    for word in words_to_clean:
        pattern = '\\b' + word + '\\s+' + word + '\\b'
        text = re.sub(pattern, word, text, flags=re.IGNORECASE)
    
    # Fix spacing around punctuation
    text = re.sub(r'\s+([.?!,;:])', r'\1', text)
    text = re.sub(r'([.?!,;:])\s*([A-Z])', r'\1 \2', text)
    
    # Capitalize first letter after sentences
    text = re.sub(r'([.!?])\s+([a-z])', lambda m: m.group(1) + ' ' + m.group(2).upper(), text)
    
    # Remove common filler words
    fillers = [
        r'\bäh\b', r'\beh\b', r'\bhmm\b', r'\bmhm\b',
        r'\birgendwie\b', r'\birgendwann\b',
        r'\bso ein bisschen\b', r'\bkrass\b', r'\bvoll\b', r'\becht\b',
    ]
    
    for filler in fillers:
        text = re.sub(filler + r'\s*', '', text, flags=re.IGNORECASE)
    
    return text.strip()

def process_interview_file(filepath):
    """Process a single interview file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split frontmatter and body
    if content.startswith('---'):
        parts = content.split('---', 2)
        frontmatter = parts[1] if len(parts) > 1 else ""
        body = parts[2] if len(parts) > 2 else ""
    else:
        frontmatter = ""
        body = content
    
    # Clean the body
    cleaned = clean_text(body)
    
    # Split into lines and filter empty ones
    lines = [line.strip() for line in cleaned.split('\n') if line.strip() and len(line.strip()) > 5]
    
    # Reconstruct file
    if frontmatter:
        return f"---{frontmatter}---\n\n" + '\n\n'.join(lines)
    else:
        return '\n\n'.join(lines)

def main():
    """Process all interview files."""
    if not INTERVIEWS_DIR.exists():
        print(f"❌ Directory not found: {INTERVIEWS_DIR}")
        return
    
    md_files = list(INTERVIEWS_DIR.glob('*.md'))
    print(f"📝 Processing {len(md_files)} interview files...\n")
    
    for filepath in sorted(md_files):
        print(f"🔧 {filepath.name}", end=' ')
        
        try:
            cleaned_content = process_interview_file(filepath)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
            
            print("✅")
        except Exception as e:
            print(f"❌ {e}")
    
    print(f"\n✨ Done!")

if __name__ == '__main__':
    main()
