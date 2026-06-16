const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('pageerror', err => {
    errors.push(`PageError: ${err.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`ConsoleError: ${msg.text()}`);
    }
  });

  console.log("Navigating to http://localhost:3000...");
  try {
    const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`Status: ${response?.status()}`);
    console.log(`Page title: ${await page.title()}`);
    
    if (errors.length > 0) {
      console.log("Errors found:");
      errors.forEach(e => console.log(`- ${e}`));
    } else {
      console.log("No console errors found!");
    }
  } catch (err) {
    console.error("Navigation failed:", err.message);
  }

  await browser.close();
})();
