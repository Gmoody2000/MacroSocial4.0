// Initialize the previousFoods array
let previousFoods = [];

// Define the searchFood function
async function searchFood() {
    const foodNameInput = document.getElementById("food-name");
    const foodName = encodeURIComponent(foodNameInput.value.trim());
    const searchResults = document.getElementById("search-results");
    const previousResults = document.getElementById("previous-results");
    const totalResults = document.getElementById("total-results");

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

                // Log the details to the previousFoods array
                previousFoods.push({
                    name: food.name,
                    calories: food.calories,
                    protein: food.protein_g,
                    carbs: food.carbohydrates_total_g,
                    fat: food.fat_total_g,
                    servingSize: food.serving_size_g,
                });

                // Add the details to the UI
                html += `
                <h3>Nutritional Information for ${food.name}</h3>
                <p>Calories: ${food.calories ? food.calories : 'N/A'} kcal</p>
                <p>Protein: ${food.protein_g !== undefined ? food.protein_g : 'N/A'}g</p>
                <p>Carbohydrates: ${food.carbohydrates_total_g !== undefined ? food.carbohydrates_total_g : 'N/A'}g</p>
                <p>Fat: ${food.fat_total_g !== undefined ? food.fat_total_g : 'N/A'}g</p>
                <p>Serving Size: ${food.serving_size_g !== undefined ? food.serving_size_g : 'N/A'}g</p>
                <hr />`; // Add a horizontal line between entries
            });

            // Append the details to the searchResults container
            searchResults.innerHTML = html;

            // Log the previous foods
            console.log('Previous Foods:', previousFoods);

            // Calculate and display the totals
            const totalCalories = previousFoods.reduce((acc, food) => acc + (food.calories || 0), 0);
            const totalProteins = previousFoods.reduce((acc, food) => acc + (food.protein || 0), 0);
            const totalCarbs = previousFoods.reduce((acc, food) => acc + (food.carbs || 0), 0);
            const totalFats = previousFoods.reduce((acc, food) => acc + (food.fat || 0), 0);

            const totalHtml = `
            <h3>Total Nutritional Information</h3>
            <p>Total Calories: ${totalCalories} kcal</p>
            <p>Total Protein: ${totalProteins}g</p>
            <p>Total Carbohydrates: ${totalCarbs}g</p>
            <p>Total Fat: ${totalFats}g</p>
            `;

            // Append the details to the totalResults container
            totalResults.innerHTML = totalHtml;

            // Append the details to the previousResults container
            previousResults.innerHTML += html;
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
