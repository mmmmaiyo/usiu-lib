jQuery(document).ready(function() {
	
	"use strict";
	// Your custom js code goes here.

	// Get the form element
	var form = document.getElementById('login-form');

	// Attach a submit event handler to the form
	form.addEventListener('submit', function (e) {
		// Prevent the form from submitting normally
		e.preventDefault();

	  	// Get the username and password values
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;

		// Create a new XMLHttpRequest object
		var xhr = new XMLHttpRequest();

		// Configure the request
		xhr.open('POST', 'http://localhost:8080/users/login', true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		// Set up a handler for when the request finishes
		xhr.onload = function () {
			if (xhr.status === 200) {
			// Parse the JSON response
			var user = JSON.parse(xhr.responseText);

			// Replace the login link with the username
			document.querySelector('.pbs-login-icon').textContent = user.username;
			document.getElementById('pbs-login').style.display = 'none';
			localStorage.setItem('isLoggedIn', 'true');
			localStorage.setItem('username', user.username);
			} else {
			alert('Check password and try again later ');
			console.error('An error occurred:', xhr.responseText);
			}
			window.location.href = 'index.html?reload=true'
		};

		// Send the request with the username and password as JSON
		xhr.send(JSON.stringify({
			username: username,
			password: password
		}));
	});

	// JavaScript
	var loginLink = document.querySelector('.js-pbs-login');
	var loginForm = document.getElementById('pbs-login');
	var link = document.querySelector('.pbs-login-icon');
	// Get logout link element
	var logOut = document.getElementById('js-pbs-logout');


	// Get account link element
	var userAcc = document.getElementById('userAccount')
	
	loginLink.addEventListener('click', function (e) {
	  e.preventDefault();
	  loginForm.style.visibility = 'visible';
	});

	var closeLink = document.querySelector('.js-pbs-closes');
	closeLink.addEventListener('click', function (e) {
	  e.preventDefault();
	  loginForm.style.visibility = 'hidden';
	});

	logOut.addEventListener('click', function(e) {
		e.preventDefault();
		localStorage.clear();
		window.location.href = 'index.html?reload=true';
	
	});

	window.onload = function () {
		var pbsSearch = document.getElementById('pbs-search');
		var searchInput = document.getElementById('searchs');
		function searchControl() {
			// Event listener for clicking the search icon
			document.querySelector('.js-pbs-search').addEventListener('click', function () {
				pbsSearch.classList.add('active');
				setTimeout(function () {
					searchInput.focus();
				}, 500);
			});

			// Event listener for clicking the close icon
			document.querySelector('.js-pbs-close').addEventListener('click', function () {
				pbsSearch.classList.remove('active');
			});
		}

		// Call the search control function
		searchControl();

		//Check if user is logged in
		const isLoggedIn = localStorage.getItem('isLoggedIn');
		if (isLoggedIn == 'true') {
			// Check if the username is stored in local storage
			var username = localStorage.getItem('username');

			if (username) {
				// If the username is found, replace the login link with the username
				document.querySelector('.pbs-login-icon').textContent = username;
				//Make logout element visible
				logOut.style.visibility = 'visible';
				console.log('username', logOut);
				//Make account element visible
				userAcc.style.visibility = 'visible';
				// window.location.href = 'index.html?reload=true';

			}
			else {
				logOut.style.visibility = 'hidden';

			}
			// refresh the page


		}


		// Send a GET request to your server to fetch the book data
		fetch('http://localhost:8080/users/books')
			.then(response => response.json())
			.then(books => {
				// Get the container element
				var container = document.getElementById('book-container');
				console.log(books);
				console.log('we are here ');

				// Function to filter and render books based on search query
				function renderBooks(searchQuery) {

					console.log('we are here 2');
					// Clear existing content in the container
					container.innerHTML = '';
					console.log(searchQuery);
					// Filter books based on the search query
					const filteredBooks = books.filter(book => {


						console.log('Book:', book); // Check the book object structure
						console.log('SearchQuery:', searchQuery); // Check the search query value

						const isTitleMatch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
						const isAuthorMatch = book.author.toLowerCase().includes(searchQuery.toLowerCase());
						const isDescriptionMatch = book.description.toLowerCase().includes(searchQuery.toLowerCase());

						console.log('Title Match:', isTitleMatch);
						console.log('Author Match:', isAuthorMatch);
						console.log('Description Match:', isDescriptionMatch);


						return (
							book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
							book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
							book.description.toLowerCase().includes(searchQuery.toLowerCase())
						);
					});
					console.log('len of books', filteredBooks.length)

					if (filteredBooks.length === 0) {
						console.log('len of books', filteredBooks.length)

						alert('No books found!');
						var noBooksMessage = document.createElement('div');
						noBooksMessage.className = 'col-md-12';
						noBooksMessage.innerHTML = '<p>No available books</p>';
						container.appendChild(noBooksMessage);
						return; // Exit the function since there are no books to render
					}


					// Loop through the filtered books and create the book elements
					filteredBooks.forEach(book => {
						var bookElement = document.createElement('div');
						bookElement.className = 'col-md-6';

						bookElement.innerHTML = `
				<div class="pbs-service-2 pbs-animates ">
				  <div class="text " style="width:auto">
					<h3>${book.title}</h3>
					<p>${book.author}</p>
					<p>${book.description}</p>
					<button class="btn btn-primary order-book-btn" data-username="${username}" data-bookid="${book._id}">Order Book</button>
				  </div>
				</div>
			  `;
						container.appendChild(bookElement);
					});

					document.querySelectorAll('.order-book-btn').forEach(button => {
						button.addEventListener('click', async (event) => {
							const username = event.target.getAttribute('data-username');
							const bookId = event.target.getAttribute('data-bookid');

							// Make a POST request to the specified route
							try {
								const response = await fetch(`http://localhost:8080/BorrowBooks/borrow/${username}/${bookId}`, {
									method: 'POST',
								});

								if (response.ok) {
									// Handle success (e.g., show a success message)
									console.log('Book ordered successfully');
									alert('Book ordered successfully')
								} else {
									// Handle errors (e.g., show an error message)
									console.error('Failed to order book');
								}
							} catch (error) {
								console.error('An error occurred:', error);
							}
						});
					});
				}

				// Event listener for the search input
				searchInput.addEventListener('keyup', function (event) {
					if (event.key === 'Enter') {
						// Append the search query to the URL as a query parameter and navigate to the new page
						window.location.href = 'search.html?query=' + encodeURIComponent(searchInput.value);
					}
				});


		});
	};

});