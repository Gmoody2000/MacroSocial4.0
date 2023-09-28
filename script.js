// Define the searchFood function
async function searchFood() {
    const foodNameInput = document.getElementById("food-name");
    const foodName = encodeURIComponent(foodNameInput.value.trim());
    const searchResults = document.getElementById("search-results");

    // Show loading message while waiting for API response
    searchResults.innerHTML = '<p>Loading...</p>';

    const url = `https://api.api-ninjas.com/v1/nutrition?query=${foodName}`;
    const apiKey = 'ZId8gyewImGimMOAOFRF4dn6Dr2gcCAIznub5EWp'; // Replace with your actual API key

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'X-Api-Key': apiKey },
        });

        console.log('Raw API Response:', response); // Log the raw response object

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const result = await response.json();

        console.log('Parsed API Response:', result); // Log the parsed response object

        // Check if the response structure matches your expectations
        if (Array.isArray(result) && result.length > 0) {
            // Update the UI with nutritional information for each item in the array
            let html = '';
            result.forEach((food) => {
                console.log('Nutritional Information for', food.name, ':', food); // Log each food item
                html += `
                    <h3>Nutritional Information for ${food.name}</h3>
                    <p>Calories: ${food.calories ? food.calories : 'N/A'} kcal</p>
                    <p>Protein_g: ${food.protein_g !== undefined ? food.protein_g : 'N/A'}g</p>
                    <p>Carbohydrates_total_g: ${food.carbohydrates_total_g !== undefined ? food.carbohydrates_total_g : 'N/A'}g</p>
                    <p>Fat_total_g: ${food.fat_total_g !== undefined ? food.fat_total_g : 'N/A'}g</p>
                    <p>serving_size_g: ${food.serving_size_g !== undefined ? food.serving_size_g : 'N/A'}g</p>
                    <hr />`; // Add a horizontal line between entries
            });
            searchResults.innerHTML = html;
        } else {
            // Handle the case where the API request is successful but the data is not as expected
            console.error('API request successful, but data is undefined or not as expected.');
            if (Array.isArray(result) && result.length === 0) {
                searchResults.innerHTML = '<p>No nutritional information found for the given query.</p>';
            } else {
                searchResults.innerHTML = '<p>Error fetching or incomplete data. Please try again.</p>';
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        searchResults.innerHTML = '<p>Error fetching data. Please try again.</p>';
    }
}

// Use jQuery to wait for the document to be ready
$(document).ready(function () {
    // Add an event listener for the button click
    $("#search-button").on("click", searchFood);
});
