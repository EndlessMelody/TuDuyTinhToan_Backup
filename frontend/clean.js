const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'src', 'app', 'page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// remove radarData array
const radarStart = `const radarData = [`;
const radarEnd = `];`;
let r1 = content.indexOf(radarStart);
let r2 = content.indexOf(radarEnd, r1);
if (r1 > 0 && r2 > r1) {
  content = content.substring(0, r1) + content.substring(r2 + radarEnd.length);
}

// remove function SidebarItem block
const sidebStart = `function SidebarItem({`;
const sidebEnd = `// ═════════ LOBBY CARD ═════════ //`;
let s1 = content.indexOf(sidebStart);
let s2 = content.indexOf(sidebEnd);
if (s1 > 0 && s2 > s1) {
  content = content.substring(0, s1) + content.substring(s2);
}

// remove unused local states in DashboardPage
content = content.replace(/const \[isSidebarOpen, setIsSidebarOpen\] = useState\(true\);\n/, '');
content = content.replace(/const \[isRightExpanded, setIsRightExpanded\] = useState\(false\);\n/, '');
content = content.replace(/const sidebarWidth = isSidebarOpen \? 280 : 80;\n/, '');

fs.writeFileSync(pageFile, content);
console.log('page.tsx cleaned successfully.');
