// DOM Elements
const searchInput = document.getElementById('conditionInput');
const searchButton = document.getElementById('btnSearch');
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear';
clearButton.style.marginLeft = '10px';
searchButton.parentNode.appendChild(clearButton);
const resultContainer = document.getElementById('result');

// Fetch data from the JSON file
async function fetchTravelData() {
    try {
        const response = await fetch('./travel_recommendation_api.json'); // Adjust path if needed
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Unable to fetch travel recommendations.');
    }
}

// Filter data by keyword
function filterByKeyword(data, keyword) {
    const keywordLower = keyword.toLowerCase();
    const results = [];

    // Match against beaches
    if (["beach", "beaches"].includes(keywordLower)) {
        results.push(...data.beaches);
    }

    // Match against temples
    if (["temple", "temples"].includes(keywordLower)) {
        results.push(...data.temples);
    }

    // Match against countries
    const countryMatch = data.countries.find(country =>
        country.name.toLowerCase() === keywordLower
    );
    if (countryMatch) {
        results.push(...countryMatch.cities);
    }

    return results;
}

// Display recommendations
function displayRecommendations(recommendations) {
    resultContainer.innerHTML = ''; // Clear previous results

    if (recommendations.length === 0) {
        resultContainer.textContent = 'No recommendations found.';
        return;
    }

    recommendations.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.style.border = '1px solid #ccc';
        itemCard.style.padding = '10px';
        itemCard.style.marginBottom = '10px';
        itemCard.style.width = '80%';

        const itemImage = document.createElement('img');
        itemImage.src = item.imageUrl;
        itemImage.alt = item.name;
        itemImage.style.width = '100%';

        const itemName = document.createElement('h3');
        itemName.textContent = item.name;

        const itemDescription = document.createElement('p');
        itemDescription.textContent = item.description;

        // Add elements to the item card
        itemCard.appendChild(itemImage);
        itemCard.appendChild(itemName);
        itemCard.appendChild(itemDescription);

        // Add item card to the results container
        resultContainer.appendChild(itemCard);
    });
}

// Handle Search button click
searchButton.addEventListener('click', async () => {
    const keyword = searchInput.value.trim();
    if (!keyword) {
        alert('Please enter a keyword.');
        return;
    }

    const data = await fetchTravelData();
    if (!data) return;

    const recommendations = filterByKeyword(data, keyword);
    displayRecommendations(recommendations);
});

// Handle Clear button click
clearButton.addEventListener('click', () => {
    resultContainer.innerHTML = '';
    searchInput.value = '';
});

// Optional: Function to display current time (example usage)
function displayCurrentTime() {
    const currentTime = new Date().toLocaleTimeString();
    const timeElement = document.createElement('p');
    timeElement.textContent = `Current Time: ${currentTime}`;
    resultContainer.appendChild(timeElement);
}
