document.addEventListener('DOMContentLoaded', function() {
    debugger;
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const isAdmin = localStorage.getItem('isAdmin');

    console.log('isAuthenticated = '+isAuthenticated);
    console.log('isAdmin = '+isAdmin);

    const navbar = document.querySelector('.navbar-nav');

    const logoutButton = document.createElement('li');
    logoutButton.classList.add('nav-item');
    logoutButton.innerHTML = `<button id="logout-button" class="btn btn-link nav-link">Logout</button>`;

    const adminButton = document.createElement('li');
    adminButton.classList.add('nav-item');
    adminButton.innerHTML = `<button id="admin-button" class="btn btn-link nav-link">Admin Dashboard</button>`;

    const ScheduleMeetingMenu = document.createElement('li');
    ScheduleMeetingMenu.classList.add('nav-item');
    ScheduleMeetingMenu.innerHTML = `<button id="schedule-meeting-button" class="btn btn-link nav-link">Schedule Meeting |</button>`;

    const MeetingDetailsMenu = document.createElement('li');
    MeetingDetailsMenu.classList.add('nav-item');
    MeetingDetailsMenu.innerHTML = `<button id="meeting-details-button" class="btn btn-link nav-link">Meeting Details |</button>`;
    // If user is authenticated
  
    if (isAuthenticated == "true") {

        //Add Additional Menu

        //Add Admin Menu
        if(isAdmin == "true"){
          //  navbar.appendChild(ScheduleMeetingMenu);
          //  navbar.appendChild(MeetingDetailsMenu);
            navbar.appendChild(adminButton);
        }
        // Admin functionality
        adminButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });

         // Admin functionality
         ScheduleMeetingMenu.addEventListener('click', function() {
            window.location.href = 'meeting-scheduler.html';
        });

         // Admin functionality
         MeetingDetailsMenu.addEventListener('click', function() {
            window.location.href = 'meeting-details.html';
        });


        // Create elements
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
       
        const welcomeMessage = document.createElement('li');
        welcomeMessage.classList.add('nav-item');
        welcomeMessage.innerHTML = `<a class="nav-link">| Welcome, ${user.firstName} ${user.lastName} |</a> `;
        
        // Remove login and register links
        document.querySelector('a[href="login.html"]').parentElement.remove();
        document.querySelector('a[href="register.html"]').parentElement.remove();
        
        // Add Admin-Dashboard, welcome message and logout button
        navbar.appendChild(welcomeMessage);
        navbar.appendChild(logoutButton);

         // Logout functionality
         logoutButton.addEventListener('click', function() {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });

       
    } else {
        // Redirect to login if not on login page
        if (window.location.pathname !== '/login.html') {
            window.location.href = 'login.html';
        }
    }

    
});
