import { test, expect } from '@playwright/test';

test('Démo LinkedIn de l\'organigramme', async ({ page }) => {
  // Configuration pour des mouvements de souris plus naturels et visibles
  await page.mouse.move(0, 0, { steps: 50 });
  await page.waitForTimeout(1000);
  
  // Démarrage de l'application
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  
  // Attendre et cliquer sur le bouton Commencer avec un mouvement naturel
  const startButton = await page.getByRole('button', { name: 'Commencer' });
  const startButtonBox = await startButton.boundingBox();
  await page.mouse.move(startButtonBox.x + startButtonBox.width/2, startButtonBox.y + startButtonBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await startButton.click();
  await page.waitForLoadState('networkidle');
  
  // Aller à l'onglet de création avec un mouvement naturel
  const createTab = await page.locator('button[value="create"]');
  const createTabBox = await createTab.boundingBox();
  await page.mouse.move(createTabBox.x + createTabBox.width/2, createTabBox.y + createTabBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await createTab.click();
  
  // Remplir le formulaire du CEO avec des mouvements naturels
  const nameInput = await page.locator('input[placeholder="e.g., John Doe"]');
  const nameInputBox = await nameInput.boundingBox();
  await page.mouse.move(nameInputBox.x + nameInputBox.width/2, nameInputBox.y + nameInputBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await nameInput.click();
  await nameInput.type('Marie Laurent', { delay: 100 });
  
  const roleInput = await page.locator('input[placeholder="e.g., Software Engineer"]');
  const roleInputBox = await roleInput.boundingBox();
  await page.mouse.move(roleInputBox.x + roleInputBox.width/2, roleInputBox.y + roleInputBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await roleInput.click();
  await roleInput.type('CEO', { delay: 100 });
  
  const deptSelect = await page.getByText('Select department');
  const deptSelectBox = await deptSelect.boundingBox();
  await page.mouse.move(deptSelectBox.x + deptSelectBox.width/2, deptSelectBox.y + deptSelectBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await deptSelect.click();
  await page.getByText('Executive').click();
  
  // Ajouter un employé avec un mouvement naturel
  const addButton = await page.getByText('Add Employee');
  const addButtonBox = await addButton.boundingBox();
  await page.mouse.move(addButtonBox.x + addButtonBox.width/2, addButtonBox.y + addButtonBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await addButton.click();
  
  // Remplir le formulaire du CTO
  const forms = await page.locator('.grid.gap-4').all();
  const secondForm = forms[1];
  
  const secondNameInput = secondForm.locator('input[placeholder="e.g., John Doe"]');
  const secondNameInputBox = await secondNameInput.boundingBox();
  await page.mouse.move(secondNameInputBox.x + secondNameInputBox.width/2, secondNameInputBox.y + secondNameInputBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await secondNameInput.click();
  await secondNameInput.type('Pierre Dubois', { delay: 100 });
  
  const secondRoleInput = secondForm.locator('input[placeholder="e.g., Software Engineer"]');
  const secondRoleInputBox = await secondRoleInput.boundingBox();
  await page.mouse.move(secondRoleInputBox.x + secondRoleInputBox.width/2, secondRoleInputBox.y + secondRoleInputBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await secondRoleInput.click();
  await secondRoleInput.type('CTO', { delay: 100 });
  
  const secondDeptSelect = secondForm.getByText('Select department');
  const secondDeptSelectBox = await secondDeptSelect.boundingBox();
  await page.mouse.move(secondDeptSelectBox.x + secondDeptSelectBox.width/2, secondDeptSelectBox.y + secondDeptSelectBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await secondDeptSelect.click();
  await page.getByText('Technology').click();
  
  const secondManagerSelect = secondForm.getByText('Select manager');
  const secondManagerSelectBox = await secondManagerSelect.boundingBox();
  await page.mouse.move(secondManagerSelectBox.x + secondManagerSelectBox.width/2, secondManagerSelectBox.y + secondManagerSelectBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await secondManagerSelect.click();
  await page.getByText('Marie Laurent (CEO)').click();
  
  // Télécharger le CSV avec un mouvement naturel
  const downloadButton = await page.locator('button:has-text("Download CSV")');
  const downloadButtonBox = await downloadButton.boundingBox();
  await page.mouse.move(downloadButtonBox.x + downloadButtonBox.width/2, downloadButtonBox.y + downloadButtonBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await downloadButton.click();
  await page.waitForTimeout(2000);
  
  // Retourner à l'onglet d'import avec un mouvement naturel
  const uploadTab = await page.locator('button[value="upload"]');
  const uploadTabBox = await uploadTab.boundingBox();
  await page.mouse.move(uploadTabBox.x + uploadTabBox.width/2, uploadTabBox.y + uploadTabBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await uploadTab.click();
  
  // Simuler le glisser-déposer du fichier
  const fileInput = await page.locator('input[type="file"]');
  const fileInputBox = await fileInput.boundingBox();
  await page.mouse.move(fileInputBox.x + fileInputBox.width/2, fileInputBox.y + fileInputBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await fileInput.setInputFiles('organization.csv');
  
  // Attendre que le graphique soit généré
  await page.waitForSelector('.org-chart-container', { state: 'visible', timeout: 10000 });
  
  // Explorer l'organigramme avec des mouvements naturels
  const zoomButton = await page.locator('button[aria-label="Zoom in"]');
  const zoomButtonBox = await zoomButton.boundingBox();
  await page.mouse.move(zoomButtonBox.x + zoomButtonBox.width/2, zoomButtonBox.y + zoomButtonBox.height/2, { steps: 50 });
  await page.waitForTimeout(1000);
  await zoomButton.click();
  
  // Animation finale
  await page.mouse.move(0, 0, { steps: 50 });
  await page.waitForTimeout(2000);
}); 