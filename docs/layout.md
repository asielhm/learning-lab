# Layout priorities

Design Learning Lab for computers first. The primary review sizes are 1366×768,
1440×900 and 1920×1080. Use the width and landscape proportions of those screens
for the model, supporting text, controls and questions. Phones may use the site,
but do not make phone layouts drive the desktop design.

Load `assets/desktop-layout.css` after the activity's own styles. It supplies a
shared, fluid page up to 1760 px and balanced desktop workspaces. New pages and
page generators must include this stylesheet. Keep line lengths readable while
letting simulations, diagrams and activity cards use the wider page.

Keep practical controls on or beside the instrument in the same experiment
area. Chemistry's draggable tools and switches stay on the illustrated bench;
its live readings sit alongside it. Use viewport height to fit the large-bench
view. Preserve keyboard access, zoom, content scrolling and existing small-screen
fallbacks. Never stretch a scientific diagram or clip a long instruction to force
it into a fixed screen ratio.
