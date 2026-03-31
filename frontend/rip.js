const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'src', 'app', 'page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// The boundaries
const startOuterRow = `  return (
    <Row
      fillWidth
      background="page"
      overflow="hidden"
      style={{ height: "100vh", color: "#1C1C1E" }}
    >
      {/* ═══════════ 1. LEFT SIDEBAR ═══════════ */}`;

const centerStart = `      </Column>

      {/* ═══════════ 2. CENTER PANEL ═══════════ */}
      <Column`;

const centerContentStart = `        {/* Sticky Glassmorphism Header */}`;

// Let's just find the indexes
let idx1 = content.indexOf(startOuterRow);
let idx2 = content.indexOf(centerContentStart);
if (idx1 > 0 && idx2 > 0) {
  content = content.substring(0, idx1) + `  return (
    <React.Fragment>
` + content.substring(idx2);
}

const rightSidebarStart = `      {/* ═══════════ 3. RIGHT SIDEBAR (Social Tracking Panel) ═══════════ */}`;
const rightSidebarEnd = `      })()}`;
const modalStart = `      {/* ═══════════ MODAL ═══════════ */}`;

let idx3 = content.indexOf(rightSidebarStart);
let idx4 = content.indexOf(modalStart);

if (idx3 > 0 && idx4 > idx3) {
  content = content.substring(0, idx3) + content.substring(idx4);
}

const footerStart = `        {/* ═══ MINI STATUS BAR (Dashboard Footer) ═══ */}`;
const footerEnd = `      {/* ═══════════ MODALS ═══════════ */}`;
let idx5 = content.indexOf(footerStart);
let idx6 = content.indexOf(footerEnd);
if (idx5 > 0 && idx6 > idx5) {
  content = content.substring(0, idx5) + content.substring(idx6);
}

// And finally we need to find closing </Row> at the end of the DashboardPage component.
// The component ends just before /* SUB-COMPONENTS */ or SidebarItem.
const endBoundary = `  );
}

// ═══════════ LOBBY CARD ═══════════ //`;

const oldEndBoundary = `        )}
      </AnimatePresence>
    </Row>
  );
}`;

let newEndBoundary = `        )}
      </AnimatePresence>
    </React.Fragment>
  );
}`;

content = content.replace(oldEndBoundary, newEndBoundary);

// Remove the unused subcomponents
const radarDataStart = `const radarData = [`;
const radarDataEnd = `];`;
// actually I can just leave 'radarData' and 'SidebarItem' in page.tsx if they are not used, TS will just complain about unused vars. 
// I will let eslint fix it if necessary, or manually delete them.

fs.writeFileSync(pageFile, content);
console.log('page.tsx refactored successfully.');
