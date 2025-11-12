import { runEnvironmentServiceTests } from './EnvironmentService.test.js';
import { runHistoryServiceTests } from './HistoryService.test.js';

/**
 * Runs all defined service tests.
 */
async function runTests() {
    const outputContainer = document.getElementById('test-output');
    if (!outputContainer) {
        console.error('Test output container #test-output not found.');
        return;
    }

    // Create toolbar for controls
    const toolbar = document.createElement('div');
    toolbar.setAttribute('part', 'toolbar');

    // Create "Open All" button
    const openAllButton = document.createElement('button');
    openAllButton.textContent = 'Open All';
    openAllButton.onclick = () => outputContainer.querySelectorAll('details').forEach(details => details.open = true);
    toolbar.appendChild(openAllButton);

    // Create "Collapse All" button
    const collapseAllButton = document.createElement('button');
    collapseAllButton.textContent = 'Collapse All';
    collapseAllButton.onclick = () => outputContainer.querySelectorAll('details').forEach(details => details.open = false);
    toolbar.appendChild(collapseAllButton);

    outputContainer.innerHTML = ''; // Clear container first
    outputContainer.appendChild(toolbar); // Add the toolbar

    const title = document.createElement('div');
    title.textContent = '--- Running Service Tests ---\n\n';
    outputContainer.appendChild(title);

    await runEnvironmentServiceTests(outputContainer);
    await runHistoryServiceTests(outputContainer);

    const footer = document.createElement('div');
    footer.textContent = '\n--- Service Tests Finished ---';
    outputContainer.appendChild(footer);
}

runTests().catch(err => {
    console.error("A test failed, preventing further execution of the test suite.", err);
});
