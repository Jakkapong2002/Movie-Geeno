$(document).ready(function() {
    let originalData = [];
    let currentPage = 1;
    const cardsPerPage = 12;
    const pagesToShow = 5; // Number of page links to show at a time
  
    // Fetch the JSON data
    $.getJSON('data.json', function(data) {
      originalData = data;
      displayCards(currentPage);
      setupPagination();
    });
  
    // Display cards for the current page
    function displayCards(page) {
      let cardContainer = $('#card-container');
      cardContainer.empty(); // Clear previous cards
  
      let start = (page - 1) * cardsPerPage;
      let end = start + cardsPerPage;
      let pageData = originalData.slice(start, end);
  
      pageData.forEach(item => {
        let card = `
          <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div class="card">
              <img src="${item.image}" class="card-img-top" alt="${item.title}">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                
                <button class="btn btn-primary video-btn" data-url="${item.live_url}">Watch Video</button>
              </div>
            </div>
          </div>
        `;
        cardContainer.append(card);
      });
  
      // Bind video button click event
      $('.video-btn').on('click', function() {
        let videoUrl = $(this).data('url');
        $('#videoPlayer').attr('src', videoUrl);
        $('#videoModal').modal('show');
      });
    }
  
    // Setup pagination controls
    function setupPagination() {
      let paginationControls = $('#pagination-controls');
      paginationControls.empty(); // Clear previous controls
  
      let totalPages = Math.ceil(originalData.length / cardsPerPage);
      let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  
      // Previous button
      if (currentPage > 1) {
        paginationControls.append('<li class="page-item"><a class="page-link" href="#" data-page="' + (currentPage - 1) + '">Previous</a></li>');
      }
  
      // Page numbers
      for (let i = startPage; i <= endPage; i++) {
        let activeClass = i === currentPage ? 'active' : '';
        let pageItem = `
          <li class="page-item ${activeClass}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
        paginationControls.append(pageItem);
      }
  
      // Next button
      if (currentPage < totalPages) {
        paginationControls.append('<li class="page-item"><a class="page-link" href="#" data-page="' + (currentPage + 1) + '">Next</a></li>');
      }
  
      // Add event listener for page links
      $('.page-link').on('click', function(event) {
        event.preventDefault();
        let page = $(this).data('page');
        if (page >= 1 && page <= totalPages) {
          currentPage = page;
          displayCards(currentPage);
          setupPagination();
        }
      });
    }
  
    // Search functionality
    $('#search-form').on('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting
      let searchQuery = $('#search-input').val().toLowerCase();
  
      let filteredData = originalData.filter(item => 
        item.title.toLowerCase().includes(searchQuery)
      );
  
      originalData = filteredData;
      currentPage = 1; // Reset to the first page
      displayCards(currentPage);
      setupPagination();
    });
  
    // Fullscreen functionality
    $('#fullscreenButton').on('click', function() {
      let iframe = document.getElementById('videoPlayer');
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.mozRequestFullScreen) { /* Firefox */
        iframe.mozRequestFullScreen();
      } else if (iframe.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) { /* IE/Edge */
        iframe.msRequestFullscreen();
      }
    });
  });
  