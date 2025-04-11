// Bond Visualization Component
// This script enhances the visualization of chemical bonds based on electronegativity differences

// Constants for visualization
const ANIMATION_DURATION = 2000; // ms
const ELECTRON_DENSITY = 10; // number of electron dots

// Create a more detailed bond visualization
function createEnhancedBondVisualization(container, element1, element2) {
  // Clear any existing visualization
  const existingViz = container.querySelector('.bond-visualization');
  if (existingViz) {
    container.removeChild(existingViz);
  }
  
  // Calculate electronegativity difference
  if (element1.electronegativity === null || element2.electronegativity === null) {
    return createUnavailableDataVisualization(container);
  }
  
  const enDiff = Math.abs(element1.electronegativity - element2.electronegativity);
  
  // Determine bond type
  let bondType, bondClass;
  if (enDiff < 0.5) {
    bondType = 'Nonpolar Covalent Bond';
    bondClass = 'nonpolar';
  } else if (enDiff <= 1.7) {
    bondType = 'Polar Covalent Bond';
    bondClass = 'polar';
  } else {
    bondType = 'Ionic Bond';
    bondClass = 'ionic';
  }
  
  // Determine which element is more electronegative
  const moreEN = element1.electronegativity > element2.electronegativity ? element1 : element2;
  const lessEN = element1.electronegativity > element2.electronegativity ? element2 : element1;
  
  // Create visualization container
  const visualization = document.createElement('div');
  visualization.className = 'bond-visualization';
  
  // Add title
  const title = document.createElement('div');
  title.className = 'bond-title';
  title.textContent = getBondTitle(bondClass);
  visualization.appendChild(title);
  
  // Create bond diagram
  const diagram = document.createElement('div');
  diagram.className = `bond-diagram ${bondClass}`;
  
  // Add content based on bond type
  if (bondClass === 'nonpolar') {
    createNonpolarBondVisualization(diagram, element1, element2);
  } else if (bondClass === 'polar') {
    createPolarBondVisualization(diagram, lessEN, moreEN, enDiff);
  } else {
    createIonicBondVisualization(diagram, lessEN, moreEN);
  }
  
  visualization.appendChild(diagram);
  
  // Add explanation
  const explanation = document.createElement('div');
  explanation.className = 'bond-explanation';
  explanation.innerHTML = getBondExplanation(bondClass, lessEN, moreEN, enDiff);
  visualization.appendChild(explanation);
  
  container.appendChild(visualization);
  
  // Initialize animations after the elements are added to the DOM
  setTimeout(() => {
    initializeBondAnimations(bondClass);
  }, 100);
}

// Create visualization for nonpolar covalent bond
function createNonpolarBondVisualization(container, element1, element2) {
  // Left atom
  const leftAtom = createAtomElement(element1);
  container.appendChild(leftAtom);
  
  // Electron cloud (shared equally)
  const electronCloud = document.createElement('div');
  electronCloud.className = 'electron-cloud';
  
  // Add electron dots
  const electrons = document.createElement('div');
  electrons.className = 'electrons';
  
  // Add individual electron dots for animation
  for (let i = 0; i < ELECTRON_DENSITY; i++) {
    const electron = document.createElement('div');
    electron.className = 'electron-dot';
    electron.style.left = `${Math.random() * 100}%`;
    electron.style.top = `${Math.random() * 100}%`;
    electrons.appendChild(electron);
  }
  
  electronCloud.appendChild(electrons);
  container.appendChild(electronCloud);
  
  // Right atom
  const rightAtom = createAtomElement(element2);
  container.appendChild(rightAtom);
}

// Create visualization for polar covalent bond
function createPolarBondVisualization(container, lessEN, moreEN, enDiff) {
  // Less electronegative atom
  const leftAtom = createAtomElement(lessEN);
  const leftCharge = document.createElement('div');
  leftCharge.className = 'partial-charge';
  leftCharge.textContent = 'δ+';
  leftAtom.appendChild(leftCharge);
  container.appendChild(leftAtom);
  
  // Electron cloud (shifted toward more electronegative atom)
  const electronCloud = document.createElement('div');
  electronCloud.className = 'electron-cloud shifted';
  
  // Calculate shift based on electronegativity difference
  const shiftPercentage = Math.min(80, Math.max(55, 50 + (enDiff / 1.7) * 30));
  electronCloud.style.background = `linear-gradient(to right, 
    rgba(255,255,255,0.1) ${100-shiftPercentage}%, 
    rgba(0,0,255,0.2) ${shiftPercentage}%)`;
  
  // Add electron dots
  const electrons = document.createElement('div');
  electrons.className = 'electrons';
  
  // Add individual electron dots with bias toward more electronegative atom
  for (let i = 0; i < ELECTRON_DENSITY; i++) {
    const electron = document.createElement('div');
    electron.className = 'electron-dot';
    
    // Bias position toward more electronegative atom
    const biasedPosition = Math.random() * 100;
    const adjustedPosition = biasedPosition + (Math.random() * 20 * (enDiff / 1.7));
    const finalPosition = Math.min(100, adjustedPosition);
    
    electron.style.left = `${finalPosition}%`;
    electron.style.top = `${Math.random() * 100}%`;
    electrons.appendChild(electron);
  }
  
  electronCloud.appendChild(electrons);
  
  // Add polarity arrow
  const polarityArrow = document.createElement('div');
  polarityArrow.className = 'polarity-arrow';
  polarityArrow.textContent = '→';
  electronCloud.appendChild(polarityArrow);
  
  container.appendChild(electronCloud);
  
  // More electronegative atom
  const rightAtom = createAtomElement(moreEN);
  const rightCharge = document.createElement('div');
  rightCharge.className = 'partial-charge';
  rightCharge.textContent = 'δ-';
  rightAtom.appendChild(rightCharge);
  container.appendChild(rightAtom);
}

// Create visualization for ionic bond
function createIonicBondVisualization(container, lessEN, moreEN) {
  // Less electronegative atom (cation)
  const leftAtom = createAtomElement(lessEN);
  const leftCharge = document.createElement('div');
  leftCharge.className = 'ionic-charge';
  leftCharge.textContent = '+';
  leftAtom.appendChild(leftCharge);
  container.appendChild(leftAtom);
  
  // Electron transfer visualization
  const electronTransfer = document.createElement('div');
  electronTransfer.className = 'electron-transfer';
  
  // Add transfer arrow
  const transferArrow = document.createElement('div');
  transferArrow.className = 'transfer-arrow';
  transferArrow.textContent = '→';
  electronTransfer.appendChild(transferArrow);
  
  // Add electron dot
  const electronDot = document.createElement('div');
  electronDot.className = 'electron-dot transferring';
  electronDot.textContent = 'e-';
  electronTransfer.appendChild(electronDot);
  
  container.appendChild(electronTransfer);
  
  // More electronegative atom (anion)
  const rightAtom = createAtomElement(moreEN);
  const rightCharge = document.createElement('div');
  rightCharge.className = 'ionic-charge';
  rightCharge.textContent = '-';
  rightAtom.appendChild(rightCharge);
  container.appendChild(rightAtom);
}

// Create a basic atom element
function createAtomElement(element) {
  const atom = document.createElement('div');
  atom.className = 'atom';
  atom.style.backgroundColor = getColorForElectronegativity(element.electronegativity);
  
  const symbol = document.createElement('div');
  symbol.className = 'atom-symbol';
  symbol.textContent = element.symbol;
  atom.appendChild(symbol);
  
  return atom;
}

// Create visualization for unavailable data
function createUnavailableDataVisualization(container) {
  const visualization = document.createElement('div');
  visualization.className = 'bond-visualization';
  
  const message = document.createElement('div');
  message.className = 'unavailable-data';
  message.textContent = 'Electronegativity data not available for one or both selected elements.';
  visualization.appendChild(message);
  
  container.appendChild(visualization);
}

// Get title for bond visualization
function getBondTitle(bondClass) {
  switch (bondClass) {
    case 'nonpolar':
      return 'Equal Electron Sharing (Nonpolar Covalent Bond)';
    case 'polar':
      return 'Unequal Electron Sharing (Polar Covalent Bond)';
    case 'ionic':
      return 'Electron Transfer (Ionic Bond)';
    default:
      return 'Bond Visualization';
  }
}

// Get explanation text for bond visualization
function getBondExplanation(bondClass, lessEN, moreEN, enDiff) {
  switch (bondClass) {
    case 'nonpolar':
      return `
        <p>In a <strong>nonpolar covalent bond</strong>, electrons are shared equally between atoms with similar electronegativity values (difference less than 0.5).</p>
        <p>The electron cloud is symmetrically distributed between the atoms, and no partial charges develop.</p>
        <p>This equal sharing occurs because both atoms have similar "pulling power" for the shared electrons.</p>
      `;
    case 'polar':
      return `
        <p>In a <strong>polar covalent bond</strong>, electrons are shared unequally between atoms with different electronegativity values (difference between 0.5 and 1.7).</p>
        <p>${moreEN.symbol} (EN: ${moreEN.electronegativity.toFixed(2)}) is more electronegative than ${lessEN.symbol} (EN: ${lessEN.electronegativity.toFixed(2)}), so it pulls the shared electrons closer to itself.</p>
        <p>This creates a partial negative charge (δ-) on ${moreEN.symbol} and a partial positive charge (δ+) on ${lessEN.symbol}, forming a dipole with a difference of ${enDiff.toFixed(2)} on the Pauling scale.</p>
      `;
    case 'ionic':
      return `
        <p>In an <strong>ionic bond</strong>, electrons are completely transferred from the less electronegative atom to the more electronegative atom (difference greater than 1.7).</p>
        <p>${lessEN.symbol} (EN: ${lessEN.electronegativity.toFixed(2)}) loses an electron to ${moreEN.symbol} (EN: ${moreEN.electronegativity.toFixed(2)}), becoming a positive ion (cation).</p>
        <p>${moreEN.symbol} gains an electron, becoming a negative ion (anion). The resulting ions are held together by strong electrostatic attraction.</p>
      `;
    default:
      return '';
  }
}

// Initialize animations for bond visualizations
function initializeBondAnimations(bondClass) {
  // Get all electron dots
  const electrons = document.querySelectorAll('.electron-dot:not(.transferring)');
  
  // Apply random animations to each electron
  electrons.forEach(electron => {
    // Set random animation properties
    const duration = ANIMATION_DURATION + (Math.random() * 1000);
    const delay = Math.random() * 1000;
    
    // Apply different animations based on bond type
    if (bondClass === 'nonpolar') {
      applyOrbitalAnimation(electron, duration, delay, 0.5);
    } else if (bondClass === 'polar') {
      applyOrbitalAnimation(electron, duration, delay, 0.7);
    }
  });
  
  // Special animation for transferring electron in ionic bond
  const transferringElectron = document.querySelector('.electron-dot.transferring');
  if (transferringElectron) {
    transferringElectron.style.animation = 'transferMove 3s ease-in-out infinite';
  }
}

// Apply orbital animation to electron
function applyOrbitalAnimation(electron, duration, delay, bias) {
  // Create keyframes for random orbital motion
  const keyframes = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    
    // Calculate position with bias toward more electronegative atom if needed
    let x = Math.sin(progress * Math.PI * 2) * (30 + Math.random() * 20);
    if (bias > 0.5) {
      x = x + (bias - 0.5) * 40; // Shift toward more electronegative atom
    }
    
    const y = Math.cos(progress * Math.PI * 2) * (30 + Math.random() * 20);
    
    keyframes.push({
      transform: `translate(${x}%, ${y}%)`,
      offset: progress
    });
  }
  
  // Apply the animation
  electron.animate(keyframes, {
    duration: duration,
    delay: delay,
    iterations: Infinity,
    easing: 'ease-in-out'
  });
}

// Replace the existing bond visualization function with the enhanced version
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
  
  // Create enhanced bond visualization
  createEnhancedBondVisualization(container, element1, element2);
}
