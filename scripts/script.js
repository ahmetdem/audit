const { ipcRenderer } = require('electron');

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

  document.getElementById('help-link').addEventListener('click', () => {
    ipcRenderer.send('open-help-pdf');
  });

  // Add click event listener to the Çıkış button
  document.getElementById('exit-link').addEventListener('click', () => {
    ipcRenderer.send('quit-app');
  });
});

