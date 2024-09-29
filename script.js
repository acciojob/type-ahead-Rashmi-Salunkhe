//your JS code here. If required.
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('typeahead');
    const suggestionsList = document.getElementById('suggestions-list');
    let debounceTimeout;

    // Function to handle API request and update the suggestion list
    async function fetchSuggestions(query) {
        if (query === "") {
            clearSuggestions();
            return;
        }

        try {
            const response = await fetch(`https://api.frontendexpert.io/api/fe/glossary-suggestions?text=${query}`);
            const suggestions = await response.json();
            updateSuggestionsList(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    // Function to update the suggestions list in the DOM
    function updateSuggestionsList(suggestions) {
        clearSuggestions();  // Clear previous suggestions

        if (suggestions.length === 0) {
            return; // If no suggestions, do nothing
        }

        // Create and append each suggestion as a list item
        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion;

            // Add click event to select the suggestion
            listItem.addEventListener('click', () => {
                input.value = suggestion;  // Set the clicked suggestion to the input
                clearSuggestions();  // Clear the suggestions after selection
            });

            suggestionsList.appendChild(listItem);
        });
    }

    // Function to clear all suggestions
    function clearSuggestions() {
        suggestionsList.innerHTML = '';  // Clear all children of the suggestions list
    }

    // Debounce function to delay API request after typing
    function debounce(callback, delay) {
        return function (...args) {
            clearTimeout(debounceTimeout);  // Clear the timeout if still running
            debounceTimeout = setTimeout(() => callback.apply(this, args), delay);  // Set a new timeout
        };
    }

    // Event listener for the input field
    input.addEventListener('input', debounce(() => {
        const query = input.value.trim();
        fetchSuggestions(query);  // Fetch suggestions only when the user stops typing for 500ms
    }, 500));
});
