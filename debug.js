// Debug script to help identify and fix issues with the simulation

// Add console logging to help debug
console.log("Debug script loaded");

// Function to check if all required files are loaded
function checkResourcesLoaded() {
  console.log("Checking resources loaded...");
  
  // Check if JSON data was loaded
  console.log("Elements data:", elements);
  
  // Check if DOM elements exist
  console.log("Periodic table container:", document.getElementById('periodic-table-container'));
  console.log("Selected elements container:", document.getElementById('selected-elements'));
  console.log("Bond analysis container:", document.getElementById('bond-analysis'));
  
  // Check if scripts are loaded
  console.log("Scripts loaded:");
  document.querySelectorAll('script').forEach(script => {
    console.log(script.src || "Inline script");
  });
}

// Function to manually load element data if fetch fails
function manuallyLoadElementData() {
  console.log("Attempting to manually load element data");
  
  // Create a simple fetch polyfill using XMLHttpRequest
  function simpleFetch(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            json: () => JSON.parse(xhr.responseText)
          });
        } else {
          reject(new Error(`HTTP error ${xhr.status}: ${xhr.statusText}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send();
    });
  }
  
  // Try different paths to find the JSON file
  const paths = [
    './data/electronegativity_values.json',
    '/home/ubuntu/covalent_bond_simulation/data/electronegativity_values.json',
    'data/electronegativity_values.json',
    '../data/electronegativity_values.json',
    '/data/electronegativity_values.json'
  ];
  
  let attemptCount = 0;
  
  function tryNextPath() {
    if (attemptCount >= paths.length) {
      console.error("All paths failed");
      return;
    }
    
    const path = paths[attemptCount++];
    console.log(`Trying path: ${path}`);
    
    simpleFetch(path)
      .then(response => response.json())
      .then(data => {
        console.log("Data loaded successfully from", path);
        elements = data.elements;
        createPeriodicTable();
      })
      .catch(error => {
        console.error(`Failed to load from ${path}:`, error);
        tryNextPath();
      });
  }
  
  tryNextPath();
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  // Wait a bit to ensure all scripts have had a chance to run
  setTimeout(() => {
    // Check if elements array is populated
    if (!elements || elements.length === 0) {
      console.warn("Elements data not loaded, attempting manual load");
      manuallyLoadElementData();
    } else {
      console.log("Elements data already loaded:", elements.length, "elements");
    }
    
    // Check resources
    checkResourcesLoaded();
    
    // Force create periodic table if container exists but is empty
    const container = document.getElementById('periodic-table-container');
    if (container && container.children.length === 0 && elements && elements.length > 0) {
      console.log("Forcing creation of periodic table");
      createPeriodicTable();
    }
  }, 1000);
});
