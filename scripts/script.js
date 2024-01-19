document.addEventListener('DOMContentLoaded', function () {

  var navLinks = document.querySelectorAll('.nav-link');
  var currentPage = window.location.pathname.split('/').pop();

  // Iterate through each nav link and apply highlighting
  navLinks.forEach(function (link) {
    var linkHref = link.querySelector('a').href.split('/').pop();

    if (linkHref === currentPage) {
      if (!link.classList.contains('active')) {
        link.classList.add('active'); // Apply the 'active' class to highlight
      }
      
      link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default link behavior (e.g., page reload)
      });
    }
  });
});
