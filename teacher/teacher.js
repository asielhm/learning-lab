import {recordingConfig} from '../assets/records/records.js?v=sheets-1';
const config = await recordingConfig;
const status = document.querySelector('#connection-status');
if (config.url) {
  const link = document.querySelector('#dashboard-link');
  link.href = config.url; link.hidden = false;
  status.textContent = 'Sign in on the next page with your teacher password.';
} else status.textContent = 'Google Sheets recording is not connected yet. Complete the setup below, then send the deployment URL to connect all four question simulators.';
