import re

with open(r'c:\Users\phanp\Code\TuDuyTinhToan_Backup\docs\proposal_new.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by ## N. headers
parts = re.split(r'(?=^## \d+\.)', content, flags=re.MULTILINE)

preamble = ""
sections = {}
ordered_sections = []
for p in parts:
    m = re.match(r'^## (\d+)\.\s*(.*)', p, re.MULTILINE)
    if m:
        num = int(m.group(1))
        title = m.group(2).strip()
        sections[num] = p
        ordered_sections.append((num, title, p))
    else:
        preamble = p

print("Current sections:")
for num, title, _ in ordered_sections:
    print(f"  {num}: {title[:60]}")

# NEW ORDER: Pain Points → Technology → Business
# Narrative: "Users suffer → We solve with tech → Here's the business"
new_order = [
    # (old_num, title_keyword, new_num)
    (1, "Team Information", 1),
    (2, "Project Title", 2),
    (4, "Target Users", 3),           # PAIN POINTS FIRST
    (3, "Computational Thinking", 4),  # How we approach solving it
    (6, "Technology", 5),             # The technical solution
    (7, "Data Resources", 6),         # Data powering the solution
    (8, "Key Features", 7),           # What users experience
    (5, "Unique Selling Point", 8),   # Why our solution is unique
    (9, "C4 Architecture", 9),        # System visualization
    (10, "Proof of Concepts", 10),    # Working code proof
    (11, "Business Model", 11),       # BUSINESS AFTER TECH
    (12, "Cost Estimation", 12),      # Financials
    (13, "Tentative Milestones", 13), # Execution
    (14, "Teamwork Process", 14),
    (15, "Commitment", 15),
]

# Bridges between sections
bridges = {
    2: '> **From Problem to People:** Having defined the "What should we eat today?" problem, we now examine who suffers from it most acutely. The following section profiles three distinct user personas—each representing a real daily frustration that TasteMap must solve.',
    3: '> **From Pain Points to Computational Approach:** Understanding who suffers (Minh\'s Instagram vs. reality gap, Khoi\'s group chat deadlock, Melody\'s "no seats" surprise) reveals what we must solve. The following section decomposes these problems into computational sub-problems, identifies solution patterns, and designs the core algorithms that will power TasteMap.',
    4: '> **From Algorithms to Implementation:** With our computational approach defined—15-dimensional vector learning, Minimax group consensus, two-pass recommendation—we now specify the technology stack that brings these algorithms to life. The following three sections detail the platform architecture, data resources, and user-facing features that translate mathematical theory into working product.',
    7: '> **From Features to Competitive Position:** Having defined what users will experience (swipe discovery, group consensus, real-time occupancy), we now articulate why TasteMap\'s approach is uniquely defensible. The following section demonstrates how our algorithmic foundation creates competitive advantages that larger platforms cannot easily replicate.',
    8: '> **From Market Position to System Design:** With our competitive advantages established, we now visualize the system at multiple levels of abstraction. The following sections present C4 architecture diagrams and working code proofs demonstrating that our algorithms perform within required latency targets.',
    10: '> **From Technical Proof to Business Viability:** Having proven our algorithms work within performance targets (~3ms cosine similarity, ~50ms Minimax consensus), we now examine whether the business model sustains itself. The following two sections present the revenue model, cost structure, and ROI analysis.',
    12: '> **From Business Viability to Execution:** With a viable business model established (60.2M VND Year 1 cost, 777M VND projected revenue, 1,191% ROI), we detail how the team will execute. The final three sections outline the development timeline, teamwork processes, and individual commitments.',
}

# Build new document
output = preamble.rstrip() + "\n\n"

for old_num, title_kw, new_num in new_order:
    # Find the section content
    sec_content = sections.get(old_num, "")
    if not sec_content:
        print(f"WARNING: Section {old_num} not found!")
        continue
    
    # Verify it's the right section by checking title
    title_match = re.match(r'^## \d+\.\s*(.*)', sec_content, re.MULTILINE)
    if title_match:
        actual_title = title_match.group(1).strip()
        if title_kw.lower() not in actual_title.lower():
            print(f"WARNING: Section {old_num} title '{actual_title[:40]}' doesn't match keyword '{title_kw}'")
    
    # Renumber main header: ## old_num. -> ## new_num.
    sec_content = re.sub(
        r'^## ' + str(old_num) + r'\.',
        f'## {new_num}.',
        sec_content,
        count=1,
        flags=re.MULTILINE
    )
    
    # Renumber subsections: ### old_num.X -> ### new_num.X
    sec_content = re.sub(
        r'^### ' + str(old_num) + r'\.(\d+)',
        lambda m: f'### {new_num}.{m.group(1)}',
        sec_content,
        flags=re.MULTILINE
    )
    
    # Renumber sub-subsections: #### old_num.X.Y -> #### new_num.X.Y
    sec_content = re.sub(
        r'^#### ' + str(old_num) + r'\.(\d+)\.(\d+)',
        lambda m: f'#### {new_num}.{m.group(1)}.{m.group(2)}',
        sec_content,
        flags=re.MULTILINE
    )
    
    # Remove any existing bridge paragraphs (lines starting with > **From or > **Bridge)
    # that are right before a --- separator at the end of the section
    lines = sec_content.split('\n')
    cleaned_lines = []
    skip_next_empty = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        # Remove old bridge paragraphs
        if stripped.startswith('> **From') or stripped.startswith('> **Bridge'):
            skip_next_empty = True
            continue
        if skip_next_empty and stripped == '':
            skip_next_empty = False
            continue
        skip_next_empty = False
        cleaned_lines.append(line)
    sec_content = '\n'.join(cleaned_lines)
    
    # Add new bridge after this section (before the --- separator)
    if new_num in bridges:
        bridge_text = bridges[new_num]
        # Find last --- in section
        last_sep = sec_content.rfind('\n---\n')
        if last_sep != -1:
            sec_content = sec_content[:last_sep] + '\n\n' + bridge_text + '\n\n' + sec_content[last_sep:]
        else:
            sec_content = sec_content.rstrip() + '\n\n' + bridge_text + '\n\n---\n'
    
    output += sec_content.rstrip() + "\n\n---\n\n"

# Clean up double separators
output = re.sub(r'\n---\n\n---\n', '\n---\n', output)
output = re.sub(r'\n---\n---\n', '\n---\n', output)

# Write output
with open(r'c:\Users\phanp\Code\TuDuyTinhToan_Backup\docs\proposal_new.md', 'w', encoding='utf-8') as f:
    f.write(output.rstrip() + "\n")

print("\nRestructure complete!")
print(f"Output length: {len(output)} chars")

# Verify
lines = output.split('\n')
print("\nFinal structure:")
for i, line in enumerate(lines, 1):
    if line.startswith('## '):
        print(f"  Line {i}: {line}")
