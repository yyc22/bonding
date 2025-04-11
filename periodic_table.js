// Periodic Table with Electronegativity Visualization
// This script creates an interactive periodic table with color-coded electronegativity values

// Global variables
let selectedElements = [];
const maxSelectedElements = 2;

// Embed element data directly to avoid CORS issues
let elements = [
  {"atomic_number": 1, "symbol": "H", "name": "Hydrogen", "electronegativity": 2.20},
  {"atomic_number": 2, "symbol": "He", "name": "Helium", "electronegativity": null},
  {"atomic_number": 3, "symbol": "Li", "name": "Lithium", "electronegativity": 0.98},
  {"atomic_number": 4, "symbol": "Be", "name": "Beryllium", "electronegativity": 1.57},
  {"atomic_number": 5, "symbol": "B", "name": "Boron", "electronegativity": 2.04},
  {"atomic_number": 6, "symbol": "C", "name": "Carbon", "electronegativity": 2.55},
  {"atomic_number": 7, "symbol": "N", "name": "Nitrogen", "electronegativity": 3.04},
  {"atomic_number": 8, "symbol": "O", "name": "Oxygen", "electronegativity": 3.44},
  {"atomic_number": 9, "symbol": "F", "name": "Fluorine", "electronegativity": 3.98},
  {"atomic_number": 10, "symbol": "Ne", "name": "Neon", "electronegativity": null},
  {"atomic_number": 11, "symbol": "Na", "name": "Sodium", "electronegativity": 0.93},
  {"atomic_number": 12, "symbol": "Mg", "name": "Magnesium", "electronegativity": 1.31},
  {"atomic_number": 13, "symbol": "Al", "name": "Aluminum", "electronegativity": 1.61},
  {"atomic_number": 14, "symbol": "Si", "name": "Silicon", "electronegativity": 1.90},
  {"atomic_number": 15, "symbol": "P", "name": "Phosphorus", "electronegativity": 2.19},
  {"atomic_number": 16, "symbol": "S", "name": "Sulfur", "electronegativity": 2.58},
  {"atomic_number": 17, "symbol": "Cl", "name": "Chlorine", "electronegativity": 3.16},
  {"atomic_number": 18, "symbol": "Ar", "name": "Argon", "electronegativity": null},
  {"atomic_number": 19, "symbol": "K", "name": "Potassium", "electronegativity": 0.82},
  {"atomic_number": 20, "symbol": "Ca", "name": "Calcium", "electronegativity": 1.00},
  {"atomic_number": 21, "symbol": "Sc", "name": "Scandium", "electronegativity": 1.36},
  {"atomic_number": 22, "symbol": "Ti", "name": "Titanium", "electronegativity": 1.54},
  {"atomic_number": 23, "symbol": "V", "name": "Vanadium", "electronegativity": 1.63},
  {"atomic_number": 24, "symbol": "Cr", "name": "Chromium", "electronegativity": 1.66},
  {"atomic_number": 25, "symbol": "Mn", "name": "Manganese", "electronegativity": 1.55},
  {"atomic_number": 26, "symbol": "Fe", "name": "Iron", "electronegativity": 1.83},
  {"atomic_number": 27, "symbol": "Co", "name": "Cobalt", "electronegativity": 1.88},
  {"atomic_number": 28, "symbol": "Ni", "name": "Nickel", "electronegativity": 1.91},
  {"atomic_number": 29, "symbol": "Cu", "name": "Copper", "electronegativity": 1.90},
  {"atomic_number": 30, "symbol": "Zn", "name": "Zinc", "electronegativity": 1.65},
  {"atomic_number": 31, "symbol": "Ga", "name": "Gallium", "electronegativity": 1.81},
  {"atomic_number": 32, "symbol": "Ge", "name": "Germanium", "electronegativity": 2.01},
  {"atomic_number": 33, "symbol": "As", "name": "Arsenic", "electronegativity": 2.18},
  {"atomic_number": 34, "symbol": "Se", "name": "Selenium", "electronegativity": 2.55},
  {"atomic_number": 35, "symbol": "Br", "name": "Bromine", "electronegativity": 2.96},
  {"atomic_number": 36, "symbol": "Kr", "name": "Krypton", "electronegativity": 3.00},
  {"atomic_number": 37, "symbol": "Rb", "name": "Rubidium", "electronegativity": 0.82},
  {"atomic_number": 38, "symbol": "Sr", "name": "Strontium", "electronegativity": 0.95},
  {"atomic_number": 39, "symbol": "Y", "name": "Yttrium", "electronegativity": 1.22},
  {"atomic_number": 40, "symbol": "Zr", "name": "Zirconium", "electronegativity": 1.33},
  {"atomic_number": 41, "symbol": "Nb", "name": "Niobium", "electronegativity": 1.60},
  {"atomic_number": 42, "symbol": "Mo", "name": "Molybdenum", "electronegativity": 2.16},
  {"atomic_number": 43, "symbol": "Tc", "name": "Technetium", "electronegativity": 1.90},
  {"atomic_number": 44, "symbol": "Ru", "name": "Ruthenium", "electronegativity": 2.20},
  {"atomic_number": 45, "symbol": "Rh", "name": "Rhodium", "electronegativity": 2.28},
  {"atomic_number": 46, "symbol": "Pd", "name": "Palladium", "electronegativity": 2.20},
  {"atomic_number": 47, "symbol": "Ag", "name": "Silver", "electronegativity": 1.93},
  {"atomic_number": 48, "symbol": "Cd", "name": "Cadmium", "electronegativity": 1.69},
  {"atomic_number": 49, "symbol": "In", "name": "Indium", "electronegativity": 1.78},
  {"atomic_number": 50, "symbol": "Sn", "name": "Tin", "electronegativity": 1.96},
  {"atomic_number": 51, "symbol": "Sb", "name": "Antimony", "electronegativity": 2.05},
  {"atomic_number": 52, "symbol": "Te", "name": "Tellurium", "electronegativity": 2.10},
  {"atomic_number": 53, "symbol": "I", "name": "Iodine", "electronegativity": 2.66},
  {"atomic_number": 54, "symbol": "Xe", "name": "Xenon", "electronegativity": 2.60},
  {"atomic_number": 55, "symbol": "Cs", "name": "Cesium", "electronegativity": 0.79},
  {"atomic_number": 56, "symbol": "Ba", "name": "Barium", "electronegativity": 0.89},
  {"atomic_number": 57, "symbol": "La", "name": "Lanthanum", "electronegativity": 1.10},
  {"atomic_number": 58, "symbol": "Ce", "name": "Cerium", "electronegativity": 1.12},
  {"atomic_number": 59, "symbol": "Pr", "name": "Praseodymium", "electronegativity": 1.13},
  {"atomic_number": 60, "symbol": "Nd", "name": "Neodymium", "electronegativity": 1.14},
  {"atomic_number": 61, "symbol": "Pm", "name": "Promethium", "electronegativity": null},
  {"atomic_number": 62, "symbol": "Sm", "name": "Samarium", "electronegativity": 1.17},
  {"atomic_number": 63, "symbol": "Eu", "name": "Europium", "electronegativity": null},
  {"atomic_number": 64, "symbol": "Gd", "name": "Gadolinium", "electronegativity": 1.20},
  {"atomic_number": 65, "symbol": "Tb", "name": "Terbium", "electronegativity": null},
  {"atomic_number": 66, "symbol": "Dy", "name": "Dysprosium", "electronegativity": 1.22},
  {"atomic_number": 67, "symbol": "Ho", "name": "Holmium", "electronegativity": 1.23},
  {"atomic_number": 68, "symbol": "Er", "name": "Erbium", "electronegativity": 1.24},
  {"atomic_number": 69, "symbol": "Tm", "name": "Thulium", "electronegativity": 1.25},
  {"atomic_number": 70, "symbol": "Yb", "name": "Ytterbium", "electronegativity": null},
  {"atomic_number": 71, "symbol": "Lu", "name": "Lutetium", "electronegativity": 1.27},
  {"atomic_number": 72, "symbol": "Hf", "name": "Hafnium", "electronegativity": 1.30},
  {"atomic_number": 73, "symbol": "Ta", "name": "Tantalum", "electronegativity": 1.50},
  {"atomic_number": 74, "symbol": "W", "name": "Tungsten", "electronegativity": 2.36},
  {"atomic_number": 75, "symbol": "Re", "name": "Rhenium", "electronegativity": 1.90},
  {"atomic_number": 76, "symbol": "Os", "name": "Osmium", "electronegativity": 2.20},
  {"atomic_number": 77, "symbol": "Ir", "name": "Iridium", "electronegativity": 2.20},
  {"atomic_number": 78, "symbol": "Pt", "name": "Platinum", "electronegativity": 2.28},
  {"atomic_number": 79, "symbol": "Au", "name": "Gold", "electronegativity": 2.54},
  {"atomic_number": 80, "symbol": "Hg", "name": "Mercury", "electronegativity": 2.00},
  {"atomic_number": 81, "symbol": "Tl", "name": "Thallium", "electronegativity": 1.62},
  {"atomic_number": 82, "symbol": "Pb", "name": "Lead", "electronegativity": 2.33},
  {"atomic_number": 83, "symbol": "Bi", "name": "Bismuth", "electronegativity": 2.02},
  {"atomic_number": 84, "symbol": "Po", "name": "Polonium", "electronegativity": 2.00},
  {"atomic_number": 85, "symbol": "At", "name": "Astatine", "electronegativity": 2.20},
  {"atomic_number": 86, "symbol": "Rn", "name": "Radon", "electronegativity": null},
  {"atomic_number": 87, "symbol": "Fr", "name": "Francium", "electronegativity": 0.70},
  {"atomic_number": 88, "symbol": "Ra", "name": "Radium", "electronegativity": 0.90},
  {"atomic_number": 89, "symbol": "Ac", "name": "Actinium", "electronegativity": 1.10},
  {"atomic_number": 90, "symbol": "Th", "name": "Thorium", "electronegativity": 1.30},
  {"atomic_number": 91, "symbol": "Pa", "name": "Protactinium", "electronegativity": 1.50},
  {"atomic_number": 92, "symbol": "U", "name": "Uranium", "electronegativity": 1.38}
];

// Color scale for electronegativity values
const colorScale = {
  min: 0.7,  // Lowest electronegativity (Francium)
  max: 4.0,  // Highest electronegativity (Fluorine)
  getColor: function(value) {
    if (value === null) return '#cccccc'; // Gray for elements with no electronegativity
    
    // Normalize the value between 0 and 1
    const normalized = (value - this.min) / (this.max - this.min);
    
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
};

// Initialize element data
function loadElementData() {
  // Data is already loaded, just create the periodic table
  createPeriodicTable();
}

// Create the periodic table
function createPeriodicTable() {
  const container = document.getElementById('periodic-table-container');
  if (!container) return;
  
  // Clear any existing content
  container.innerHTML = '';
  
  // Create the table structure
  const table = document.createElement('div');
  table.className = 'periodic-table';
  
  // Define the layout of the periodic table
  const layout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10],
    [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, 57, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    [87, 88, 89, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 0, 0],
    [0, 0, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 0, 0]
  ];
  
  // Create elements in the table
  layout.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'periodic-row';
    
    row.forEach((atomicNumber, colIndex) => {
      if (atomicNumber === 0) {
        // Empty cell
        const emptyCell = document.createElement('div');
        emptyCell.className = 'element empty';
        rowElement.appendChild(emptyCell);
      } else {
        // Find element data
        const element = elements.find(e => e.atomic_number === atomicNumber);
        if (element) {
          const elementCell = createElementCell(element);
          rowElement.appendChild(elementCell);
        }
      }
    });
    
    table.appendChild(rowElement);
  });
  
  container.appendChild(table);
  
  // Add legend
  createLegend(container);
}

// Create an individual element cell
function createElementCell(element) {
  const cell = document.createElement('div');
  cell.className = 'element';
  cell.dataset.atomicNumber = element.atomic_number;
  
  // Set background color based on electronegativity
  cell.style.backgroundColor = colorScale.getColor(element.electronegativity);
  
  // Add element symbol
  const symbol = document.createElement('div');
  symbol.className = 'symbol';
  symbol.textContent = element.symbol;
  cell.appendChild(symbol);
  
  // Add atomic number
  const number = document.createElement('div');
  number.className = 'atomic-number';
  number.textContent = element.atomic_number;
  cell.appendChild(number);
  
  // Add electronegativity value
  const en = document.createElement('div');
  en.className = 'electronegativity';
  en.textContent = element.electronegativity !== null ? element.electronegativity.toFixed(2) : '-';
  cell.appendChild(en);
  
  // Add click event for element selection
  cell.addEventListener('click', () => selectElement(element));
  
  return cell;
}

// Create a legend for the electronegativity color scale
function createLegend(container) {
  const legend = document.createElement('div');
  legend.className = 'legend';
  
  const title = document.createElement('h3');
  title.textContent = 'Electronegativity (Pauling Scale)';
  legend.appendChild(title);
  
  const scale = document.createElement('div');
  scale.className = 'color-scale';
  
  // Create gradient stops
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const value = colorScale.min + (colorScale.max - colorScale.min) * (i / steps);
    const stop = document.createElement('div');
    stop.className = 'color-stop';
    stop.style.backgroundColor = colorScale.getColor(value);
    
    if (i % 2 === 0) {
      const label = document.createElement('div');
      label.className = 'scale-label';
      label.textContent = value.toFixed(1);
      stop.appendChild(label);
    }
    
    scale.appendChild(stop);
  }
  
  legend.appendChild(scale);
  container.appendChild(legend);
  
  // Add bond type thresholds
  const thresholds = document.createElement('div');
  thresholds.className = 'thresholds';
  thresholds.innerHTML = `
    <div><span class="threshold-marker" style="background-color: #ffcc00;"></span> Difference < 0.5: Nonpolar Covalent Bond</div>
    <div><span class="threshold-marker" style="background-color: #00ccff;"></span> Difference 0.5-1.7: Polar Covalent Bond</div>
    <div><span class="threshold-marker" style="background-color: #ff3366;"></span> Difference > 1.7: Ionic Bond</div>
  `;
  container.appendChild(thresholds);
}

// Handle element selection
function selectElement(element) {
  // Check if element is already selected
  const index = selectedElements.findIndex(e => e.atomic_number === element.atomic_number);
  
  if (index !== -1) {
    // Element is already selected, remove it
    selectedElements.splice(index, 1);
  } else {
    // Add element if we haven't reached the maximum
    if (selectedElements.length < maxSelectedElements) {
      selectedElements.push(element);
    } else {
      // Replace the first element if we've reached the maximum
      selectedElements.shift();
      selectedElements.push(element);
    }
  }
  
  // Update UI to reflect selection
  updateSelectedElements();
  
  // If we have two elements selected, analyze their bond
  if (selectedElements.length === 2) {
    analyzeBond(selectedElements[0], selectedElements[1]);
  } else {
    // Clear bond analysis if we don't have exactly two elements
    clearBondAnalysis();
  }
}

// Update the UI to show selected elements
function updateSelectedElements() {
  const container = document.getElementById('selected-elements');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Selected Elements';
  container.appendChild(title);
  
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
      elementBox.style.backgroundColor = colorScale.getColor(element.electronegativity);
      
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
  
  // Update the highlighting in the periodic table
  updatePeriodicTableHighlighting();
}

// Update highlighting in the periodic table
function updatePeriodicTableHighlighting() {
  // Remove existing highlighting
  document.querySelectorAll('.element').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Add highlighting to selected elements
  selectedElements.forEach(element => {
    const cell = document.querySelector(`.element[data-atomic-number="${element.atomic_number}"]`);
    if (cell) {
      cell.classList.add('selected');
    }
  });
}

// Analyze the bond between two elements
function analyzeBond(element1, element2) {
  const container = document.getElementById('bond-analysis');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Bond Analysis';
  container.appendChild(title);
  
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
        <div class="atom" style="background-color: ${colorScale.getColor(element1.electronegativity)}">
          <div class="atom-symbol">${element1.symbol}</div>
        </div>
        <div class="electron-cloud">
          <div class="electrons"></div>
        </div>
        <div class="atom" style="background-color: ${colorScale.getColor(element2.electronegativity)}">
          <div class="atom-symbol">${element2.symbol}</div>
        </div>
      </div>
    `;
  } else if (bondType === 'Polar Covalent Bond') {
    visualization.innerHTML = `
      <div class="bond-title">Unequal Electron Sharing</div>
      <div class="bond-diagram polar">
        <div class="atom" style="background-color: ${colorScale.getColor(lessEN.electronegativity)}">
          <div class="atom-symbol">${lessEN.symbol}</div>
          <div class="partial-charge">δ+</div>
        </div>
        <div class="electron-cloud shifted">
          <div class="electrons"></div>
          <div class="polarity-arrow">→</div>
        </div>
        <div class="atom" style="background-color: ${colorScale.getColor(moreEN.electronegativity)}">
          <div class="atom-symbol">${moreEN.symbol}</div>
          <div class="partial-charge">δ-</div>
        </div>
      </div>
    `;
  } else {
    visualization.innerHTML = `
      <div class="bond-title">Electron Transfer</div>
      <div class="bond-diagram ionic">
        <div class="atom" style="background-color: ${colorScale.getColor(lessEN.electronegativity)}">
          <div class="atom-symbol">${lessEN.symbol}</div>
          <div class="ionic-charge">+</div>
        </div>
        <div class="electron-transfer">
          <div class="transfer-arrow">→</div>
          <div class="electron-dot">e-</div>
        </div>
        <div class="atom" style="background-color: ${colorScale.getColor(moreEN.electronegativity)}">
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
  
  // Clear existing content
  container.innerHTML = '';
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Bond Analysis';
  container.appendChild(title);
  
  // Add message
  const message = document.createElement('p');
  message.textContent = 'Select two elements to analyze their bond.';
  container.appendChild(message);
}

// Initialize the periodic table when the page loads
document.addEventListener('DOMContentLoaded', loadElementData);
