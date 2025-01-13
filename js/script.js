const mapData = [
  { id: 1, name: "Abyssal Reef" },
  { id: 2, name: "Amygdala" },
  { id: 3, name: "El Dorado" },
  { id: 4, name: "King's Cove" },
  { id: 5, name: "Ley Lines" },
  { id: 6, name: "Neon Violet Square" },
  { id: 7, name: "Frostline" },
  { id: 8, name: "Ultralove" },
  { id: 9, name: "Whispers of Gold" },
];

const BEST_OF_SETTINGS = {
  None: 0,
  BO2: 2,
  BO3: 3,
  BO5: 5,
  BO7: 7,
  BO9: 9,
};

function canVetoMoreMaps() {
  const unvetoedCount = countUnvetoedMaps();
  const currentBestOf = bestOfOptions[currentBestOfIndex];
  const bestOfLimit = BEST_OF_SETTINGS[currentBestOf];
  return unvetoedCount > bestOfLimit; // True if you can veto more maps
}

function keepHoveredMap() {
  if (lastHoveredMap) {
    showPreview(lastHoveredMap); // Continue showing the last hovered map
  }
}

// Function to dynamically generate the map list
function renderMapList() {
  const mapList = document.querySelector(".map-list");
  mapData.forEach((map) => {
    const li = document.createElement("li");
    li.setAttribute("id", `map${map.id}`); // Add an id for each li element
    li.innerHTML = `
      <span id="label${map.id}">${map.name}</span>
      <span class="order-indicator" onclick="cycleOrder(${map.id}, event)"></span>
    `;
    li.setAttribute("onclick", `toggleVeto(${map.id})`);
    li.setAttribute("onmouseover", `showPreview(${map.id})`);
    li.setAttribute("onmouseout", "keepHoveredMap()");
    mapList.appendChild(li);
  });
}

// Call this function when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", renderMapList);

// Object to store map preview images (initial images are placeholders)
let mapImages = {
  1: "maps/abyssal_reef.jpg",
  2: "maps/amygdala.jpg",
  3: "maps/el_dorado.jpg",
  4: "maps/king's_cove.jpg",
  5: "maps/ley_lines.jpg",
  6: "maps/neon_violet_square.jpg",
  7: "maps/snowpiercer.jpg",
  8: "maps/ultralove.jpg",
  9: "maps/whispers_of_gold.jpg",
};

// Variable to track the currently selected map in the list
let currentMap = null; // Tracks the currently vetoed map
let lastHoveredMap = null; // Tracks the last hovered map

// Function to show the map preview
function showPreview(mapNumber) {
  const previewImage = document.getElementById("previewImage");

  // Set the image source to the map's stored image
  previewImage.src = mapImages[mapNumber];
  previewImage.alt = `Map ${mapNumber} Preview`;

  lastHoveredMap = mapNumber; // Update last hovered map
}

// Function to count unvetoed maps
function countUnvetoedMaps() {
  const allMaps = document.querySelectorAll(".map-list li");
  let unvetoedCount = 0;
  allMaps.forEach((liElement) => {
    if (!liElement.classList.contains("vetoed-map")) {
      unvetoedCount++;
    }
  });
  return unvetoedCount;
}

// Function to toggle the veto
function toggleVeto(mapNumber) {
  const liElement = document.getElementById(`map${mapNumber}`);
  const indicator = liElement.querySelector(".order-indicator");

  // Check if the map is already vetoed
  if (liElement.classList.contains("vetoed-map")) {
    // If it's already vetoed, un-veto the map
    liElement.classList.remove("vetoed-map");
    const currentBestOf = bestOfOptions[currentBestOfIndex];
    if (currentBestOf !== "None") {
      indicator.style.display = "inline-block";
    } else {
      indicator.style.display = "none";
    }
    if (indicator.textContent.trim() === "") {
      indicator.textContent = "";
    }
  } else {
    // If it's not vetoed, check if we can veto more maps
    if (!canVetoMoreMaps()) {
      return; // Exit without vetoing more maps
    }

    // Otherwise, veto the map
    liElement.classList.add("vetoed-map");
    indicator.style.display = "none";
  }

  currentMap = mapNumber;
  const previewImage = document.getElementById("previewImage");
  if (currentMap) {
    previewImage.src = mapImages[currentMap];
  }

  // Check the number of unvetoed maps
  checkUnvetoedMapsForBestOf();
}

// Function to apply pulsing border based on "Best of" setting
function checkUnvetoedMapsForBestOf() {
  const unvetoedCount = countUnvetoedMaps();
  const bestOfTarget = {
    BO2: 2,
    BO3: 3,
    BO5: 5,
    BO7: 7,
    BO9: 9,
  };

  const currentBestOf = bestOfOptions[currentBestOfIndex];

  const allMaps = document.querySelectorAll(".map-list li");
  allMaps.forEach((liElement) => {
    liElement.classList.remove("pulsing-border"); // Remove existing pulsing border
  });

  // Apply the pulsing effect if unvetoed maps match the target
  if (
    bestOfTarget[currentBestOf] &&
    unvetoedCount === bestOfTarget[currentBestOf]
  ) {
    allMaps.forEach((liElement) => {
      if (!liElement.classList.contains("vetoed-map")) {
        liElement.classList.add("pulsing-border");
      }
    });
  }
}

// Ensure pulsing is checked when the "Best of" changes
document.getElementById("nextBestOfButton").addEventListener("click", () => {
  currentBestOfIndex = (currentBestOfIndex + 1) % bestOfOptions.length;
  updateDisplayedBestOf();
  checkUnvetoedMapsForBestOf(); // Check pulsing after changing Best of
});

document.getElementById("prevBestOfButton").addEventListener("click", () => {
  currentBestOfIndex =
    (currentBestOfIndex - 1 + bestOfOptions.length) % bestOfOptions.length;
  updateDisplayedBestOf();
  checkUnvetoedMapsForBestOf(); // Check pulsing after changing Best of
});

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
  "Map 9",
];

let currentIndex = 0; // Start at the first map

// Function to update the displayed text
function updateDisplayedMap() {
  const selectedMapText = document.getElementById("selectedMapText");
  selectedMapText.textContent = mapData[currentIndex].name; // Use mapData for the actual map name
}

// Event listener for the previous map button
document.getElementById("prevMapButton").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + mapData.length) % mapData.length; // Cycle back
  updateDisplayedMap(); // Update the displayed text
});

// Event listener for the next map button
document.getElementById("nextMapButton").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % mapData.length; // Cycle forward
  updateDisplayedMap(); // Update the displayed text
});

// Initialize the display
updateDisplayedMap(); // Set initial display

// Function to update the map name in the list
function updateMapName() {
  const newMapName = document.getElementById("newMapName").value.trim(); // Get the new map name

  if (newMapName) {
    const selectedMap = mapData[currentIndex]; // Get the currently selected map object

    // Update the map name in the data and UI
    selectedMap.name = newMapName;
    const label = document.getElementById(`label${selectedMap.id}`);
    if (label) {
      label.textContent = newMapName; // Update the map list label
    }

    updateDisplayedMap(); // Update the displayed map name
    document.getElementById("newMapName").value = ""; // Clear the input field
  } else {
    alert("Please enter a new map name.");
  }
}

// Add event listener to the Change Map Name button
document
  .getElementById("changeMapNameButton")
  .addEventListener("click", updateMapName);

// List of Best of options
const bestOfOptions = ["None", "BO2", "BO3", "BO5", "BO7", "BO9"];

let currentBestOfIndex = 0; // Start at "None"

// Function to update the displayed Best of option
function updateDisplayedBestOf() {
  const selectedBestOfText = document.getElementById("selectedBestOfText");
  selectedBestOfText.textContent = `Best of: ${bestOfOptions[currentBestOfIndex]}`;
}

// Initialize the display for Best of
updateDisplayedBestOf(); // Set initial display for Best of

function cycleOrder(mapNumber, event) {
  event.stopPropagation(); // Prevent the click event from bubbling up to the <li>

  // Get the order indicator span by selecting the specific map's li element
  const liElement = document.getElementById(`map${mapNumber}`);
  const indicator = liElement.querySelector(".order-indicator");

  // Check if the map is vetoed
  if (liElement.classList.contains("vetoed-map")) {
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
    case "BO2":
      maxOrders = 2;
      break;
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

// Function to reset all vetoed maps, indicators, and pulsing borders
function resetAll() {
  // Select all the map list items
  const allMaps = document.querySelectorAll(".map-list li");

  // Reset veto status, order indicators, and remove pulsing-border class
  allMaps.forEach((liElement) => {
    liElement.classList.remove("vetoed-map"); // Remove veto class
    liElement.classList.remove("pulsing-border"); // Remove pulsing-border class
    const indicator = liElement.querySelector(".order-indicator");
    indicator.textContent = ""; // Clear the order indicator text
    indicator.style.display = "inline-block"; // Show the order indicator
  });

  // Reset the currently vetoed map
  currentMap = null;

  // Reset last hovered map
  lastHoveredMap = null;

  // Reset the preview image
  resetPreview(); // Reset to placeholder image

  // Reset the best of selection to "None"
  currentBestOfIndex = 0; // Reset to the first option (None)
  updateDisplayedBestOf(); // Update displayed Best of text
}

// Function to update the map preview image based on the selected map
function updateMapPreview(event) {
  const file = event.target.files[0]; // Get the selected file

  if (file) {
    const reader = new FileReader(); // Create a FileReader object

    // When the file is read, update the preview image
    reader.onload = function (e) {
      const previewImage = document.getElementById("previewImage");

      // Get the selected map ID from the selectedMapText
      const selectedMapText =
        document.getElementById("selectedMapText").textContent;
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
document.getElementById("resetButton").addEventListener("click", resetAll);

// Function to hide or show the map preview
function toggleMapPreviewVisibility() {
  const previewImage = document.getElementById("previewImage");
  const hidePreviewCheckbox = document.getElementById("hidePreviewCheckbox");

  if (hidePreviewCheckbox.checked) {
    previewImage.style.display = "none"; // Hide the preview image
  } else {
    previewImage.style.display = "block"; // Show the preview image
  }
}

// Add hidden class to the elements on page load
document.addEventListener("DOMContentLoaded", function () {
  const elementsToHide = [
    document.querySelector(".button-container"),
    document.getElementById("newMapName"),
    document.getElementById("changeMapNameButton"),
    document.getElementById("ChangeMapPreview"),
    document.getElementById("custom-checkbox"), // Assuming this is the checkbox ID
  ];

  // Hide elements by adding the 'hidden' class
  elementsToHide.forEach((el) => el.classList.add("hidden"));
});

document
  .getElementById("toggleVisibilityButton")
  .addEventListener("click", function () {
    const elementsToToggle = [
      document.querySelector(".button-container"),
      document.getElementById("newMapName"),
      document.getElementById("changeMapNameButton"),
      document.getElementById("ChangeMapPreview"),
      document.getElementById("custom-checkbox"), // Assuming this is the checkbox ID
    ];

    let allHidden = elementsToToggle.every((el) =>
      el.classList.contains("hidden")
    );

    // Toggle the visibility of each element
    elementsToToggle.forEach((el) => {
      el.classList.toggle("hidden"); // Toggle the 'hidden' class
    });

    // Update button text based on visibility
    this.textContent = allHidden ? "Hide" : "Show";
  });
