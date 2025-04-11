// Educational Content and Tooltips
// This script adds educational explanations and tooltips to enhance the learning experience

// Constants for educational content
const ELECTRONEGATIVITY_DEFINITION = "Electronegativity is a measure of an atom's ability to attract shared electrons in a chemical bond.";
const BOND_TYPE_THRESHOLDS = {
  nonpolar: 0.5,
  polar: 1.7
};

// Add tooltips to elements in the periodic table
function addPeriodicTableTooltips() {
  document.querySelectorAll('.element:not(.empty)').forEach(element => {
    const atomicNumber = element.dataset.atomicNumber;
    if (!atomicNumber) return;
    
    const elementData = elements.find(e => e.atomic_number === parseInt(atomicNumber));
    if (!elementData) return;
    
    // Create tooltip content
    const tooltipContent = createElementTooltip(elementData);
    
    // Add tooltip functionality
    element.setAttribute('title', tooltipContent);
    
    // Add hover event for more detailed tooltip (optional enhancement)
    element.addEventListener('mouseenter', (event) => showDetailedTooltip(event, elementData));
    element.addEventListener('mouseleave', hideDetailedTooltip);
  });
}

// Create basic tooltip content for an element
function createElementTooltip(element) {
  let content = `${element.name} (${element.symbol})`;
  content += `\nAtomic Number: ${element.atomic_number}`;
  
  if (element.electronegativity !== null) {
    content += `\nElectronegativity: ${element.electronegativity.toFixed(2)}`;
  } else {
    content += "\nElectronegativity: Not available";
  }
  
  return content;
}

// Show a more detailed tooltip on hover
function showDetailedTooltip(event, element) {
  // Remove any existing detailed tooltip
  hideDetailedTooltip();
  
  // Create detailed tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'detailed-tooltip';
  
  // Add content to tooltip
  tooltip.innerHTML = `
    <h3>${element.name} (${element.symbol})</h3>
    <p><strong>Atomic Number:</strong> ${element.atomic_number}</p>
    ${element.electronegativity !== null ? 
      `<p><strong>Electronegativity:</strong> ${element.electronegativity.toFixed(2)}</p>` : 
      `<p><strong>Electronegativity:</strong> Not available</p>`}
    <p class="tooltip-info">${getElementInfo(element)}</p>
  `;
  
  // Position tooltip near the element
  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX + rect.width}px`;
  tooltip.style.top = `${rect.top + window.scrollY}px`;
  
  // Add tooltip to document
  document.body.appendChild(tooltip);
}

// Hide the detailed tooltip
function hideDetailedTooltip() {
  const tooltip = document.querySelector('.detailed-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Get additional information about an element
function getElementInfo(element) {
  // This could be expanded with more element-specific information
  if (element.electronegativity === null) {
    return "Electronegativity data not available for this element.";
  }
  
  let info = "";
  
  // Categorize element based on electronegativity
  if (element.electronegativity < 1.5) {
    info += "This element has relatively low electronegativity and tends to form cations (positive ions) in ionic compounds.";
  } else if (element.electronegativity >= 1.5 && element.electronegativity < 2.5) {
    info += "This element has moderate electronegativity and can form both polar and nonpolar covalent bonds depending on the partner element.";
  } else {
    info += "This element has high electronegativity and tends to form anions (negative ions) in ionic compounds or pull shared electrons toward itself in covalent bonds.";
  }
  
  return info;
}

// Add explanations to the bond analysis section
function enhanceBondAnalysis() {
  // This function will be called when a bond is analyzed
  // It adds additional educational content to the bond analysis section
  
  const originalAnalyzeBond = window.analyzeBond;
  
  // Override the analyzeBond function to add additional explanations
  window.analyzeBond = function(element1, element2) {
    // Call the original function first
    originalAnalyzeBond(element1, element2);
    
    // Add additional educational content
    addBondEducationalContent(element1, element2);
  };
}

// Add educational content to the bond analysis section
function addBondEducationalContent(element1, element2) {
  const container = document.getElementById('bond-analysis');
  if (!container) return;
  
  // Check if both elements have electronegativity values
  if (element1.electronegativity === null || element2.electronegativity === null) {
    return; // No additional content if data is missing
  }
  
  // Calculate electronegativity difference
  const enDiff = Math.abs(element1.electronegativity - element2.electronegativity);
  
  // Create educational content
  const educationalContent = document.createElement('div');
  educationalContent.className = 'educational-content';
  
  // Add content based on bond type
  if (enDiff < BOND_TYPE_THRESHOLDS.nonpolar) {
    educationalContent.innerHTML = createNonpolarEducationalContent(element1, element2);
  } else if (enDiff <= BOND_TYPE_THRESHOLDS.polar) {
    educationalContent.innerHTML = createPolarEducationalContent(element1, element2, enDiff);
  } else {
    educationalContent.innerHTML = createIonicEducationalContent(element1, element2, enDiff);
  }
  
  // Add to container
  container.appendChild(educationalContent);
}

// Create educational content for nonpolar covalent bonds
function createNonpolarEducationalContent(element1, element2) {
  return `
    <h3>Understanding Nonpolar Covalent Bonds</h3>
    <p>The bond between ${element1.symbol} and ${element2.symbol} is nonpolar because their electronegativity values are very similar:</p>
    <ul>
      <li>${element1.symbol}: ${element1.electronegativity.toFixed(2)}</li>
      <li>${element2.symbol}: ${element2.electronegativity.toFixed(2)}</li>
      <li>Difference: ${Math.abs(element1.electronegativity - element2.electronegativity).toFixed(2)}</li>
    </ul>
    <p>In nonpolar covalent bonds:</p>
    <ul>
      <li>Electrons are shared equally between atoms</li>
      <li>The electron cloud is symmetrically distributed</li>
      <li>No partial charges develop on either atom</li>
      <li>The molecule has no dipole moment at the bond level</li>
    </ul>
    <p>Examples of molecules with nonpolar bonds include H₂, O₂, N₂, and CH₄ (methane).</p>
    <p class="learning-tip"><strong>Learning Tip:</strong> Think of nonpolar bonds like two equally strong people playing tug-of-war with a rope - neither side pulls the rope (electrons) more toward themselves.</p>
  `;
}

// Create educational content for polar covalent bonds
function createPolarEducationalContent(element1, element2, enDiff) {
  // Determine which element is more electronegative
  const moreEN = element1.electronegativity > element2.electronegativity ? element1 : element2;
  const lessEN = element1.electronegativity > element2.electronegativity ? element2 : element1;
  
  return `
    <h3>Understanding Polar Covalent Bonds</h3>
    <p>The bond between ${element1.symbol} and ${element2.symbol} is polar because there is a significant difference in their electronegativity values:</p>
    <ul>
      <li>${lessEN.symbol}: ${lessEN.electronegativity.toFixed(2)}</li>
      <li>${moreEN.symbol}: ${moreEN.electronegativity.toFixed(2)}</li>
      <li>Difference: ${enDiff.toFixed(2)}</li>
    </ul>
    <p>In polar covalent bonds:</p>
    <ul>
      <li>Electrons are shared unequally between atoms</li>
      <li>The electron cloud is shifted toward the more electronegative atom (${moreEN.symbol})</li>
      <li>The more electronegative atom (${moreEN.symbol}) gains a partial negative charge (δ-)</li>
      <li>The less electronegative atom (${lessEN.symbol}) gains a partial positive charge (δ+)</li>
      <li>The bond has a dipole moment (separation of charge)</li>
    </ul>
    <p>Examples of molecules with polar bonds include H₂O (water), NH₃ (ammonia), and HCl (hydrogen chloride).</p>
    <p class="learning-tip"><strong>Learning Tip:</strong> Think of polar bonds like a tug-of-war where one person (the more electronegative atom) is stronger and pulls the rope (electrons) more toward their side.</p>
  `;
}

// Create educational content for ionic bonds
function createIonicEducationalContent(element1, element2, enDiff) {
  // Determine which element is more electronegative
  const moreEN = element1.electronegativity > element2.electronegativity ? element1 : element2;
  const lessEN = element1.electronegativity > element2.electronegativity ? element2 : element1;
  
  return `
    <h3>Understanding Ionic Bonds</h3>
    <p>The bond between ${element1.symbol} and ${element2.symbol} is ionic because there is a large difference in their electronegativity values:</p>
    <ul>
      <li>${lessEN.symbol}: ${lessEN.electronegativity.toFixed(2)}</li>
      <li>${moreEN.symbol}: ${moreEN.electronegativity.toFixed(2)}</li>
      <li>Difference: ${enDiff.toFixed(2)}</li>
    </ul>
    <p>In ionic bonds:</p>
    <ul>
      <li>Electrons are completely transferred from one atom to another</li>
      <li>The less electronegative atom (${lessEN.symbol}) loses electrons and becomes a positive ion (cation)</li>
      <li>The more electronegative atom (${moreEN.symbol}) gains electrons and becomes a negative ion (anion)</li>
      <li>The ions are held together by strong electrostatic attraction</li>
    </ul>
    <p>Examples of ionic compounds include NaCl (table salt), MgO (magnesium oxide), and CaF₂ (calcium fluoride).</p>
    <p class="learning-tip"><strong>Learning Tip:</strong> Think of ionic bonds like one person giving up the rope (electrons) entirely to the other person, and then being attracted to them because of the resulting opposite charges.</p>
  `;
}

// Add interactive learning features
function addInteractiveLearningFeatures() {
  // Add a "Did You Know?" section with random facts
  addRandomFactsSection();
  
  // Add interactive quiz questions
  addQuizQuestions();
}

// Add a section with random facts about electronegativity and bonding
function addRandomFactsSection() {
  const facts = [
    "Fluorine is the most electronegative element on the periodic table, with a value of 3.98 on the Pauling scale.",
    "Francium is the least electronegative element, with a value of 0.7 on the Pauling scale.",
    "The concept of electronegativity was developed by Linus Pauling, who won the Nobel Prize in Chemistry in 1954.",
    "Water (H₂O) is a polar molecule because of the large electronegativity difference between hydrogen and oxygen.",
    "Carbon dioxide (CO₂) is a nonpolar molecule overall, despite having polar C=O bonds, because the bonds are arranged symmetrically.",
    "The polarity of a bond affects properties like boiling point, melting point, and solubility.",
    "Hydrogen bonding, a special type of intermolecular force, occurs between molecules with highly polar N-H, O-H, or F-H bonds.",
    "Noble gases (He, Ne, Ar, etc.) have complete electron shells and rarely form bonds with other elements."
  ];
  
  // Create the facts section
  const factsSection = document.createElement('div');
  factsSection.className = 'facts-section';
  factsSection.innerHTML = `
    <h3>Did You Know?</h3>
    <div class="fact" id="random-fact">${facts[Math.floor(Math.random() * facts.length)]}</div>
    <button id="new-fact-btn">Show Another Fact</button>
  `;
  
  // Add to the educational content section
  const educationalContent = document.querySelector('.educational-content');
  if (educationalContent) {
    educationalContent.appendChild(factsSection);
    
    // Add event listener to the button
    setTimeout(() => {
      const newFactBtn = document.getElementById('new-fact-btn');
      if (newFactBtn) {
        newFactBtn.addEventListener('click', () => {
          const factElement = document.getElementById('random-fact');
          if (factElement) {
            factElement.textContent = facts[Math.floor(Math.random() * facts.length)];
          }
        });
      }
    }, 100);
  }
}

// Add interactive quiz questions
function addQuizQuestions() {
  const quizQuestions = [
    {
      question: "What type of bond forms when the electronegativity difference is less than 0.5?",
      options: ["Ionic Bond", "Polar Covalent Bond", "Nonpolar Covalent Bond", "Metallic Bond"],
      answer: 2
    },
    {
      question: "What type of bond forms when the electronegativity difference is between 0.5 and 1.7?",
      options: ["Ionic Bond", "Polar Covalent Bond", "Nonpolar Covalent Bond", "Metallic Bond"],
      answer: 1
    },
    {
      question: "What type of bond forms when the electronegativity difference is greater than 1.7?",
      options: ["Ionic Bond", "Polar Covalent Bond", "Nonpolar Covalent Bond", "Metallic Bond"],
      answer: 0
    },
    {
      question: "In a polar covalent bond, which atom gets a partial negative charge?",
      options: ["The less electronegative atom", "The more electronegative atom", "Both atoms equally", "Neither atom"],
      answer: 1
    },
    {
      question: "Which element has the highest electronegativity on the Pauling scale?",
      options: ["Oxygen", "Nitrogen", "Fluorine", "Chlorine"],
      answer: 2
    }
  ];
  
  // Create the quiz section
  const quizSection = document.createElement('div');
  quizSection.className = 'quiz-section';
  quizSection.innerHTML = `
    <h3>Test Your Knowledge</h3>
    <div id="quiz-container">
      <div id="quiz-question"></div>
      <div id="quiz-options"></div>
      <div id="quiz-feedback"></div>
      <button id="quiz-next-btn">Next Question</button>
    </div>
  `;
  
  // Add to the educational content section
  const educationalContent = document.querySelector('.educational-content');
  if (educationalContent) {
    educationalContent.appendChild(quizSection);
    
    // Initialize the quiz
    setTimeout(() => {
      initializeQuiz(quizQuestions);
    }, 100);
  }
}

// Initialize the quiz functionality
function initializeQuiz(questions) {
  let currentQuestion = 0;
  
  const questionElement = document.getElementById('quiz-question');
  const optionsElement = document.getElementById('quiz-options');
  const feedbackElement = document.getElementById('quiz-feedback');
  const nextButton = document.getElementById('quiz-next-btn');
  
  if (!questionElement || !optionsElement || !feedbackElement || !nextButton) return;
  
  // Display the first question
  displayQuestion(questions[currentQuestion]);
  
  // Add event listener to the next button
  nextButton.addEventListener('click', () => {
    // Clear feedback
    feedbackElement.innerHTML = '';
    feedbackElement.className = '';
    
    // Move to the next question or loop back to the beginning
    currentQuestion = (currentQuestion + 1) % questions.length;
    displayQuestion(questions[currentQuestion]);
  });
  
  // Function to display a question
  function displayQuestion(questionData) {
    questionElement.textContent = questionData.question;
    
    // Clear options
    optionsElement.innerHTML = '';
    
    // Add options
    questionData.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'quiz-option';
      optionElement.textContent = option;
      
      // Add click event
      optionElement.addEventListener('click', () => {
        // Check answer
        if (index === questionData.answer) {
          feedbackElement.textContent = "Correct!";
          feedbackElement.className = 'correct';
        } else {
          feedbackElement.textContent = `Incorrect. The correct answer is: ${questionData.options[questionData.answer]}`;
          feedbackElement.className = 'incorrect';
        }
        
        // Highlight the correct answer
        document.querySelectorAll('.quiz-option').forEach((opt, i) => {
          if (i === questionData.answer) {
            opt.classList.add('correct-answer');
          } else {
            opt.classList.remove('correct-answer');
          }
        });
      });
      
      optionsElement.appendChild(optionElement);
    });
  }
}

// Initialize all educational features
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the periodic table to be loaded
  setTimeout(() => {
    // Add tooltips to periodic table elements
    addPeriodicTableTooltips();
    
    // Enhance bond analysis with educational content
    enhanceBondAnalysis();
    
    // Add interactive learning features
    addInteractiveLearningFeatures();
    
    // Add CSS for educational features
    addEducationalStyles();
  }, 1000); // Wait for other scripts to initialize
});

// Add CSS styles for educational features
function addEducationalStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Tooltip styles */
    .detailed-tooltip {
      position: absolute;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      max-width: 300px;
    }
    
    .detailed-tooltip h3 {
      margin-top: 0;
      color: #3498db;
    }
    
    .tooltip-info {
      font-style: italic;
      margin-top: 10px;
    }
    
    /* Educational content styles */
    .educational-content {
      margin-top: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #3498db;
    }
    
    .educational-content h3 {
      color: #2ecc71;
      margin-top: 0;
    }
    
    .educational-content ul {
      padding-left: 20px;
    }
    
    .learning-tip {
      background-color: #fffde7;
      padding: 10px;
      border-radius: 4px;
      margin-top: 15px;
      border-left: 4px solid #ffc107;
    }
    
    /* Facts section styles */
    .facts-section {
      margin-top: 20px;
      padding: 15px;
      background-color: #e8f4fd;
      border-radius: 4px;
    }
    
    .fact {
      font-style: italic;
      margin: 10px 0;
    }
    
    #new-fact-btn {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    #new-fact-btn:hover {
      background-color: #2980b9;
    }
    
    /* Quiz styles */
    .quiz-section {
      margin-top: 20px;
      padding: 15px;
      background-color: #f0f8ff;
      border-radius: 4px;
    }
    
    #quiz-question {
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .quiz-option {
      padding: 8px 12px;
      margin: 5px 0;
      background-color: #f1f1f1;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .quiz-option:hover {
      background-color: #e0e0e0;
    }
    
    .quiz-option.correct-answer {
      background-color: #d4edda;
      border-color: #c3e6cb;
    }
    
    #quiz-feedback {
      margin: 15px 0;
      padding: 10px;
      border-radius: 4px;
    }
    
    #quiz-feedback.correct {
      background-color: #d4edda;
      color: #155724;
    }
    
    #quiz-feedback.incorrect {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    #quiz-next-btn {
      background-color: #2ecc71;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    #quiz-next-btn:hover {
      background-color: #27ae60;
    }
  `;
  
  document.head.appendChild(styleElement);
}
