#!/usr/bin/env python3
"""
Fix the Audio Player block in index.html:
1. Remove the blinking pink icon with white radio symbol
2. Change padding to move the player down below the logo
"""

import re

filepath = '/Users/demetriusoliveira/Desktop/onewave-dashboard/index.html'

with open(filepath, 'r') as f:
    content = f.read()

# Change 1: Remove the blinking pink icon div (3 lines)
pink_pattern = r'<div class="w-24 h-24 mx-auto mb-6 rounded-full bg-pink-500 animate-pulse flex items-center justify-center">\s*\n\s*<i class="fas fa-radio text-4xl text-white"></i>\s*\n\s*</div>'

match = re.search(pink_pattern, content)
if match:
    print(f"Found pink icon at position {match.start()}-{match.end()}")
    print(f"Matched text: {repr(match.group())}")
    content = content[:match.start()] + content[match.end():]
    print("Removed pink icon div")
else:
    print("Pattern not found with regex, trying line-by-line approach")
    lines = content.split('\n')
    new_lines = []
    skip_count = 0
    for i, line in enumerate(lines):
        if skip_count > 0:
            skip_count -= 1
            print(f"  Skipping line {i+1}: {line.strip()[:80]}")
            continue
        if 'bg-pink-500 animate-pulse' in line and 'fa-radio' not in line:
            if i+1 < len(lines) and 'fa-radio' in lines[i+1]:
                if i+2 < len(lines) and '</div>' in lines[i+2]:
                    print(f"  Removing line {i+1}: {line.strip()[:80]}")
                    print(f"  Removing line {i+2}: {lines[i+1].strip()[:80]}")
                    print(f"  Removing line {i+3}: {lines[i+2].strip()[:80]}")
                    skip_count = 2
                    continue
        new_lines.append(line)
    content = '\n'.join(new_lines)
    print("Removed pink icon via line-by-line approach")

# Change 2: Modify the section padding to move player down
old_section_class = 'class="py-20 bg-black text-center relative overflow-hidden"'
new_section_class = 'class="pt-[500px] pb-10 bg-black text-center relative overflow-hidden"'

if old_section_class in content:
    content = content.replace(old_section_class, new_section_class, 1)
    print("Changed section padding from py-20 to pt-[500px] pb-10")
else:
    print(f"Section class pattern not found, searching alternatives...")
    if 'py-20 bg-black text-center' in content:
        content = content.replace('py-20 bg-black text-center', 'pt-[500px] pb-10 bg-black text-center', 1)
        print("Changed padding via alternative pattern")
    else:
        print("WARNING: Could not find section padding to change")

with open(filepath, 'w') as f:
    f.write(content)

print("\n=== Verification ===")
with open(filepath, 'r') as f:
    new_content = f.read()

if 'bg-pink-500 animate-pulse' in new_content:
    print("WARNING: Pink icon may still be present!")
else:
    print("OK: Pink icon removed")

if 'pt-[500px]' in new_content:
    print("OK: Section padding updated to pt-[500px]")
else:
    print("WARNING: Section padding may not have been updated")

print("\nDone!")
