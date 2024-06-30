// config.js
const BASE_API_URL = 'http://localhost:5000';

// Create elements
const user = JSON.parse(localStorage.getItem('loggedInUser'));

// Handle request for bier buddy button button click
  async function sendEmail() {
      debugger;
      let email_test = `Hi Champ,

      I hope this message finds you in high spirits!

      In the pursuit of fostering a jovial and collaborative team atmosphere, I have a bubbly request. I believe it's time we embrace the concept of "beer buddies" on our profiles! 🍺

      Imagine the fun and laughter as we virtually clink our mugs, celebrate small victories, and unwind after a productive week. Adding beer buddies would undoubtedly boost team camaraderie and make our interactions even more delightful.

      So, what do you say? Let's toast to a more spirited and connected team by adding this fizzy feature. I'm eagerly awaiting your thumbs-up to this sparkling idea!

      Cheers and Beers,
      
      ${user.firstName +' '+user.lastName}
      `
      let email_body = { "subject":"A Bubbly Request for Beer Buddies!", "userId":`${user.firstName +' '+user.lastName}`, "text":`${email_test}` };
      
      try {
          const response = await fetch(`${BASE_API_URL}/send-email`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(email_body)
          });

          alert(response.msg);

         /* if (response.ok) {
              alert('Email Send successfully!');
          } else {
              alert('Email Sent Failed.');
          }*/
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while updating the profile.');
      }
  };


  
