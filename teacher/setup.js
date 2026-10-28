const status = document.querySelector('#copy-status');
const validFiles=new Set(['Code.gs','QuestionBank.gs','Dashboard.html']);
for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    if(!validFiles.has(button.dataset.copy))return;
    button.disabled = true;
    try {
      const response = await fetch(new URL(`../google-apps-script/${button.dataset.copy}`, import.meta.url), {cache:'no-store'});
      if (!response.ok) throw new Error();
      const code = await response.text();
      await navigator.clipboard.writeText(code);
      status.textContent = `${button.dataset.copy} copied. Paste it into the matching file in Apps Script.`;
    } catch {status.textContent = 'Could not copy automatically. Use the download link and copy the file’s text.';}
    finally {button.disabled = false;}
  });
}
