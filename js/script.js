

const mapData = [
  { id: 1, name: 'Alcyone' },
  { id: 2, name: 'Amphion' },
  { id: 3, name: 'Crimson Court' },
  { id: 4, name: 'Dynasty' },
  { id: 5, name: 'Ghost River' },
  { id: 6, name: 'Goldenaura' },
  { id: 7, name: 'Oceanborn' },
  { id: 8, name: 'Post-Youth' },
  { id: 9, name: 'Site Delta' }
];

function keepHoveredMap() {
  if (lastHoveredMap) {
    showPreview(lastHoveredMap); // Continue showing the last hovered map
  }
}

// Function to dynamically generate the map list
function renderMapList() {
  const mapList = document.querySelector('.map-list');
  mapData.forEach(map => {
    const li = document.createElement('li');
    li.setAttribute('id', `map${map.id}`);  // Add an id for each li element
    li.innerHTML = `
      <span id="label${map.id}">${map.name}</span>
      <span class="order-indicator" onclick="cycleOrder(${map.id}, event)"></span>
    `;
    li.setAttribute('onclick', `toggleVeto(${map.id})`);
    li.setAttribute('onmouseover', `showPreview(${map.id})`);
    li.setAttribute('onmouseout', 'keepHoveredMap()');
    mapList.appendChild(li);
  });
}


// Call this function when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', renderMapList);


// Object to store map preview images (initial images are placeholders)
let mapImages = {
  1: "maps/alcyone.jpg",
  2: "maps/amphion.jpg",
  3: "maps/crimson_court.jpg",
  4: "maps/dynasty.jpg",
  5: "maps/ghost_river.jpg",
  6: "maps/goldenaura.jpg",
  7: "maps/oceanborn.jpg",
  8: "maps/post-youth.jpg",
  9: "maps/site_delta.jpg"
};

// Variable to track the currently selected map in the list
let currentMap = null; // Tracks the currently vetoed map
let lastHoveredMap = null; // Tracks the last hovered map

// Function to show the map preview
function showPreview(mapNumber) {
  const previewImage = document.getElementById('previewImage');
  
  // Set the image source to the map's stored image
  previewImage.src = mapImages[mapNumber];
  previewImage.alt = `Map ${mapNumber} Preview`;
  
  lastHoveredMap = mapNumber; // Update last hovered map
}

// Function to toggle the veto
function toggleVeto(mapNumber) {
  const liElement = document.getElementById(`map${mapNumber}`); // Select the li using its id
  const indicator = liElement.querySelector('.order-indicator'); // Get the order indicator

  // Check if the map is already vetoed
  if (liElement.classList.contains('vetoed-map')) {
    // If the map is already vetoed, just un-veto it
    liElement.classList.remove('vetoed-map'); // Remove veto class

    // Only show the order indicator if the "Best of" option is not "None"
    const currentBestOf = bestOfOptions[currentBestOfIndex]; // Get the current "Best of" selection
    if (currentBestOf !== "None") {
      indicator.style.display = 'inline-block'; // Show the order indicator again
    } else {
      indicator.style.display = 'none'; // Keep the order indicator hidden if "None" is selected
    }

    // Reset the order indicator when un-vetoing if it was empty
    if (indicator.textContent.trim() === "") {
      indicator.textContent = ""; // Make sure it remains empty
    }

    // Check if there are any other vetoed maps
    const otherVetoedMaps = document.querySelectorAll('.map-list li.vetoed-map');
    if (otherVetoedMaps.length === 0) {
      currentMap = null; // Clear current map if no other map is vetoed
      resetPreview(); // Reset to placeholder only if no vetoed maps
    }
  } else {
    // If the map is not vetoed, add vetoed class
    liElement.classList.add('vetoed-map'); // Add vetoed class
    currentMap = mapNumber; // Update current map
    indicator.style.display = 'none'; // Hide the order indicator
  }

  // Set the preview image to the currently vetoed map
  const previewImage = document.getElementById('previewImage');
  if (currentMap) {
    previewImage.src = mapImages[currentMap]; // Show the vetoed map's preview
  }
}


// List of maps
const maps = [
  "Map 1",
  "Map 2",
  "Map 3",
  "Map 4",
  "Map 5",
  "Map 6",
  "Map 7",
  "Map 8",
  "Map 9"
];

let currentIndex = 0; // Start at the first map

// Function to update the displayed text
function updateDisplayedMap() {
  const selectedMapText = document.getElementById('selectedMapText');
  selectedMapText.textContent = `${maps[currentIndex]}`;
}

// Event listener for the previous map button
document.getElementById('prevMapButton').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + mapData.length) % mapData.length; // Cycle back
  updateDisplayedMap(); // Update the displayed text
});

// Event listener for the next map button
document.getElementById('nextMapButton').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % mapData.length; // Cycle forward
  updateDisplayedMap(); // Update the displayed text
});

// Initialize the display
updateDisplayedMap(); // Set initial display


// Function to update the map name in the list
function updateMapName() {
  // Get the currently selected map from the text
  const selectedMapText = document.getElementById('selectedMapText').textContent;

  // Check if the text is in the expected format
  const match = selectedMapText.match(/Map (\d+)/);
  if (match) {
    const selectedMapId = parseInt(match[1]); // Extract the map ID from the matched text

    const newMapName = document.getElementById('newMapName').value; // Get new name from input

    if (newMapName) {
      const label = document.getElementById(`label${selectedMapId}`); // Get the label element using the parsed map ID
      if (label) {
        label.textContent = newMapName; // Update the label in the map list
      } else {
        alert("Map not found. Please select a valid map."); // Error handling for invalid map ID
      }

      // Clear the input field after updating
      document.getElementById('newMapName').value = '';
    } else {
      alert("Please enter a new map name.");
    }
  } else {
    alert("No map selected. Please select a map to update.");
  }
}


// Add event listener to the Change Map Name button
document.getElementById('changeMapNameButton').addEventListener('click', updateMapName);



// List of Best of options
const bestOfOptions = [
  "None",
  "BO3",
  "BO5",
  "BO7",
  "BO9"
];

let currentBestOfIndex = 0; // Start at "None"

// Function to update the displayed Best of option
function updateDisplayedBestOf() {
  const selectedBestOfText = document.getElementById('selectedBestOfText');
  selectedBestOfText.textContent = `Best of: ${bestOfOptions[currentBestOfIndex]}`;
}

// Event listener for the previous Best of button
document.getElementById('prevBestOfButton').addEventListener('click', () => {
  currentBestOfIndex = (currentBestOfIndex - 1 + bestOfOptions.length) % bestOfOptions.length; // Cycle back
  updateDisplayedBestOf(); // Update the displayed text
});

// Event listener for the next Best of button
document.getElementById('nextBestOfButton').addEventListener('click', () => {
  currentBestOfIndex = (currentBestOfIndex + 1) % bestOfOptions.length; // Cycle forward
  updateDisplayedBestOf(); // Update the displayed text
});

// Initialize the display for Best of
updateDisplayedBestOf(); // Set initial display for Best of


function cycleOrder(mapNumber, event) {
  event.stopPropagation(); // Prevent the click event from bubbling up to the <li>

  // Get the order indicator span by selecting the specific map's li element
  const liElement = document.getElementById(`map${mapNumber}`);
  const indicator = liElement.querySelector('.order-indicator');

  // Check if the map is vetoed
  if (liElement.classList.contains('vetoed-map')) {
    return; // Do not allow cycling if the map is vetoed
  }

  // Only allow cycling if a valid "Best of" option is selected
  const currentBestOf = bestOfOptions[currentBestOfIndex];
  if (currentBestOf === "None") {
    return; // Do nothing if "None" is selected
  }

  // Determine the max number of orders based on the current best of selection
  let maxOrders;
  switch (currentBestOf) {
    case "BO3":
      maxOrders = 3;
      break;
    case "BO5":
      maxOrders = 5;
      break;
    case "BO7":
      maxOrders = 7;
      break;
    case "BO9":
      maxOrders = 9;
      break;
  }

  // Get current order from the text
  const currentText = indicator.textContent.trim();
  let nextOrder;

  // Cycle through the order indicators
  if (currentText === "") {
    nextOrder = "1."; // Start with "1."
  } else {
    const currentIndex = parseInt(currentText) || 0; // Parse the current number or default to 0

    if (currentIndex < maxOrders) {
      nextOrder = `${currentIndex + 1}.`; // Increment the order if it's less than maxOrders
    } else {
      nextOrder = ""; // If the max has been reached, go to "Nothing"
    }
  }

  // Update the indicator text
  indicator.textContent = nextOrder;
}


// Function to reset all vetoed maps and indicators
function resetAll() {
  // Reset veto status for all maps
  const allMaps = document.querySelectorAll('.map-list li');
  allMaps.forEach(liElement => {
    liElement.classList.remove('vetoed-map'); // Remove veto class
    const indicator = liElement.querySelector('.order-indicator');
    indicator.textContent = ""; // Clear the order indicator text
    indicator.style.display = 'inline-block'; // Show the order indicator
  });

  // Reset the currently vetoed map
  currentMap = null;

  // Reset last hovered map
  lastHoveredMap = null;

  // Reset the preview image
  resetPreview(); // Reset to placeholder image
  
  // Reset best of selection to None
  currentBestOfIndex = 0; // Reset to the first option (None)
  updateDisplayedBestOf(); // Update displayed Best of text
}

// Function to update the map preview image based on the selected map
function updateMapPreview(event) {
  const file = event.target.files[0]; // Get the selected file

  if (file) {
    const reader = new FileReader(); // Create a FileReader object

    // When the file is read, update the preview image
    reader.onload = function(e) {
      const previewImage = document.getElementById('previewImage');
      
      // Get the selected map ID from the selectedMapText
      const selectedMapText = document.getElementById('selectedMapText').textContent;
      const match = selectedMapText.match(/Map (\d+)/);
      if (match) {
        const selectedMapId = parseInt(match[1]); // Extract the map ID

        // Update the mapImages object to store the new image path
        mapImages[selectedMapId] = e.target.result; // Use the file data as the new image source

        // Also update the preview image for the currently selected map
        previewImage.src = e.target.result; // Show the new image in the preview
        previewImage.alt = `Map ${selectedMapId} Preview`; // Update alt text
      } else {
        alert("No map selected. Please select a map to update.");
      }
    };

    // Read the file as a Data URL
    reader.readAsDataURL(file);
  }
}




// Add event listener to the reset button
document.getElementById('resetButton').addEventListener('click', resetAll);
