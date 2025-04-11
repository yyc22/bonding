// Element Selection and Bond Analysis Functionality
// This script handles the selection of elements and analysis of bonds

// Global variables for tracking selected elements
let selectedElements = [];
const maxSelectedElements = 2;

// Initialize the element selection functionality
function initElementSelection() {
  // Add click event listeners to all element cells in the periodic table
  document.querySelectorAll('.element:not(.empty)').forEach(elementCell => {
    elementCell.addEventListener('click', handleElementClick);
  });
  
  // Initialize the selected elements display
  updateSelectedElementsDisplay();
  
  // Initialize the bond analysis section
  clearBondAnalysis();
}

// Handle click on an element in the periodic table
function handleElementClick(event) {
  const elementCell = event.currentTarget;
  const atomicNumber = parseInt(elementCell.dataset.atomicNumber);
  
  // Find the element data
  const element = elements.find(e => e.atomic_number === atomicNumber);
  if (!element) return;
  
  // Check if element is already selected
  const index = selectedElements.findIndex(e => e.atomic_number === atomicNumber);
  
  if (index !== -1) {
    // Element is already selected, remove it
    selectedElements.splice(index, 1);
    elementCell.classList.remove('selected');
  } else {
    // Add element if we haven't reached the maximum
    if (selectedElements.length < maxSelectedElements) {
      selectedElements.push(element);
      elementCell.classList.add('selected');
    } else {
      // Replace the first element if we've reached the maximum
      const firstElementCell = document.querySelector(`.element[data-atomic-number="${selectedElements[0].atomic_number}"]`);
      if (firstElementCell) {
        firstElementCell.classList.remove('selected');
      }
      
      selectedElements.shift();
      selectedElements.push(element);
      elementCell.classList.add('selected');
    }
  }
  
  // Update the UI
  updateSelectedElementsDisplay();
  
  // If we have two elements selected, analyze their bond
  if (selectedElements.length === 2) {
    analyzeBond(selectedElements[0], selectedElements[1]);
  } else {
    // Clear bond analysis if we don't have exactly two elements
    clearBondAnalysis();
  }
}

// Update the display of selected elements
function updateSelectedElementsDisplay() {
  const container = document.getElementById('selected-elements');
  if (!container) return;
  
  // Clear existing content except the heading
  const heading = container.querySelector('h2');
  container.innerHTML = '';
  container.appendChild(heading);
  
  // Add selected elements
  if (selectedElements.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'Click on elements in the periodic table to select them (maximum 2).';
    container.appendChild(message);
  } else {
    const elementsContainer = document.createElement('div');
    elementsContainer.className = 'selected-elements-container';
    
    selectedElements.forEach(element => {
      const elementBox = document.createElement('div');
      elementBox.className = 'selected-element';
      elementBox.style.backgroundColor = getColorForElectronegativity(element.electronegativity);
      
      const symbol = document.createElement('div');
      symbol.className = 'selected-symbol';
      symbol.textContent = element.symbol;
      elementBox.appendChild(symbol);
      
      const name = document.createElement('div');
      name.className = 'selected-name';
      name.textContent = element.name;
      elementBox.appendChild(name);
      
      const en = document.createElement('div');
      en.className = 'selected-en';
      en.textContent = `EN: ${element.electronegativity !== null ? element.electronegativity.toFixed(2) : '-'}`;
      elementBox.appendChild(en);
      
      elementsContainer.appendChild(elementBox);
    });
    
    container.appendChild(elementsContainer);
  }
}

// Get color based on electronegativity value
function getColorForElectronegativity(value) {
  if (value === null) return '#cccccc'; // Gray for elements with no electronegativity
  
  const min = 0.7;  // Lowest electronegativity (Francium)
  const max = 4.0;  // Highest electronegativity (Fluorine)
  
  // Normalize the value between 0 and 1
  const normalized = (value - min) / (max - min);
  
  // Create a color gradient from red (low EN) to yellow to blue (high EN)
  if (normalized < 0.5) {
    // Red to yellow
    const r = 255;
    const g = Math.round(normalized * 2 * 255);
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to blue
    const r = Math.round((1 - (normalized - 0.5) * 2) * 255);
    const g = Math.round((1 - (normalized - 0.5) * 2) * 255);
    const b = Math.round((normalized - 0.5) * 2 * 255);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

// Analyze the bond between two elements
function analyzeBond(element1, element2) {
  const container = document.getElementById('bond-analysis');
  if (!container) return;
  
  // Clear existing content except the heading
  const heading = container.querySelector('h2');
  container.innerHTML = '';
  container.appendChild(heading);
  
  // Check if both elements have electronegativity values
  if (element1.electronegativity === null || element2.electronegativity === null) {
    const message = document.createElement('p');
    message.textContent = 'Electronegativity data not available for one or both selected elements.';
    container.appendChild(message);
    return;
  }
  
  // Calculate electronegativity difference
  const enDiff = Math.abs(element1.electronegativity - element2.electronegativity);
  
  // Determine bond type
  let bondType, bondDescription;
  if (enDiff < 0.5) {
    bondType = 'Nonpolar Covalent Bond';
    bondDescription = 'Electrons are shared equally between atoms.';
  } else if (enDiff <= 1.7) {
    bondType = 'Polar Covalent Bond';
    bondDescription = 'Electrons are shared unequally, with a partial negative charge on the more electronegative atom.';
  } else {
    bondType = 'Ionic Bond';
    bondDescription = 'Electrons are transferred from the less electronegative atom to the more electronegative atom.';
  }
  
  // Create bond information
  const bondInfo = document.createElement('div');
  bondInfo.className = 'bond-info';
  
  const diffElement = document.createElement('div');
  diffElement.className = 'en-difference';
  diffElement.innerHTML = `<strong>Electronegativity Difference:</strong> ${enDiff.toFixed(2)}`;
  bondInfo.appendChild(diffElement);
  
  const typeElement = document.createElement('div');
  typeElement.className = 'bond-type';
  typeElement.innerHTML = `<strong>Bond Type:</strong> ${bondType}`;
  bondInfo.appendChild(typeElement);
  
  const descElement = document.createElement('div');
  descElement.className = 'bond-description';
  descElement.innerHTML = `<strong>Description:</strong> ${bondDescription}`;
  bondInfo.appendChild(descElement);
  
  container.appendChild(bondInfo);
  
  // Create bond visualization
  createBondVisualization(container, element1, element2, enDiff, bondType);
}

// Create a visualization of the bond
function createBondVisualization(container, element1, element2, enDiff, bondType) {
  const visualization = document.createElement('div');
  visualization.className = 'bond-visualization';
  
  // Determine which element is more electronegative
  const moreEN = element1.electronegativity > element2.electronegativity ? element1 : element2;
  const lessEN = element1.electronegativity > element2.electronegativity ? element2 : element1;
  
  // Create visualization based on bond type
  if (bondType === 'Nonpolar Covalent Bond') {
    visualization.innerHTML = `
      <div class="bond-title">Equal Electron Sharing</div>
      <div class="bond-diagram nonpolar">
        <div class="atom" style="background-color: ${getColorForElectronegativity(element1.electronegativity)}">
          <div class="atom-symbol">${element1.symbol}</div>
        </div>
        <div class="electron-cloud">
          <div class="electrons"></div>
        </div>
        <div class="atom" style="background-color: ${getColorForElectronegativity(element2.electronegativity)}">
          <div class="atom-symbol">${element2.symbol}</div>
        </div>
      </div>
    `;
  } else if (bondType === 'Polar Covalent Bond') {
    visualization.innerHTML = `
      <div class="bond-title">Unequal Electron Sharing</div>
      <div class="bond-diagram polar">
        <div class="atom" style="background-color: ${getColorForElectronegativity(lessEN.electronegativity)}">
          <div class="atom-symbol">${lessEN.symbol}</div>
          <div class="partial-charge">δ+</div>
        </div>
        <div class="electron-cloud shifted">
          <div class="electrons"></div>
          <div class="polarity-arrow">→</div>
        </div>
        <div class="atom" style="background-color: ${getColorForElectronegativity(moreEN.electronegativity)}">
          <div class="atom-symbol">${moreEN.symbol}</div>
          <div class="partial-charge">δ-</div>
        </div>
      </div>
    `;
  } else {
    visualization.innerHTML = `
      <div class="bond-title">Electron Transfer</div>
      <div class="bond-diagram ionic">
        <div class="atom" style="background-color: ${getColorForElectronegativity(lessEN.electronegativity)}">
          <div class="atom-symbol">${lessEN.symbol}</div>
          <div class="ionic-charge">+</div>
        </div>
        <div class="electron-transfer">
          <div class="transfer-arrow">→</div>
          <div class="electron-dot">e-</div>
        </div>
        <div class="atom" style="background-color: ${getColorForElectronegativity(moreEN.electronegativity)}">
          <div class="atom-symbol">${moreEN.symbol}</div>
          <div class="ionic-charge">-</div>
        </div>
      </div>
    `;
  }
  
  container.appendChild(visualization);
}

// Clear bond analysis
function clearBondAnalysis() {
  const container = document.getElementById('bond-analysis');
  if (!container) return;
  
  // Clear existing content except the heading
  const heading = container.querySelector('h2');
  container.innerHTML = '';
  container.appendChild(heading);
  
  // Add message
  const message = document.createElement('p');
  message.textContent = 'Select two elements to analyze their bond.';
  container.appendChild(message);
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load element data first, then initialize element selection
  loadElementData().then(() => {
    initElementSelection();
  });
});
