document.getElementById('meeting-scheduler-form').addEventListener('submit', function (event) {
  event.preventDefault();

  debugger;

  const frequency_days={"daily":1,"weekly":7,"monthly":31,"yearly":365};

  const frequency = frequency_days[document.getElementById('frequency').value];
  alert(frequency)
  const start_date = document.getElementById('start_date').value;

  async function generateSchedule() {
    try {
      // Retrieve user data from Json Server
      const response = await fetch(`${BASE_API_URL}/users`);
      var employees = await response.json();

      employees=employees.filter(user=>user.id!=='efd8');

      if (employees.length < 2) {
        alert('At least two employees are required to generate a schedule.');
        return;
      }

      if(employees.length%2!=0){
          const No_Call= {
            "userName": "No Call",
            "firstName": "No Call",
            "lastName": "No Call",
            "email": "No Call",
            "password": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4Nbbeeeee8a81f6f2ab448a918",
            "isAdmin": false,
            "id": "efd8999"
          }
          employees.push(No_Call);
      }

      meeting_schedule = [];


      for (var i = 0, j = 0; i < employees.length - 1; i++, j=j+frequency) {
        schedule = {};
        schedule.seq = i + 1;
        var someDate = new Date(start_date);
        someDate.setDate(someDate.getDate() + j);

        if (someDate.getDay() == 6) {
          someDate.setDate(someDate.getDate() + 2);
          j = j + 2;
        }
        schedule.meeting_date = someDate.toDateString();
        schedule.teams = [];
        meeting_schedule.push(schedule);
      }

      let meetings = [];
      let count = 1;
      var last_pointer = 0;

      for (let i = 0; i < employees.length - 1; i++) {

        for (let j = i + 1; j < employees.length; j++) {

          let result = {};
          result.seq = count++;
          result.team = [employees[i], employees[j]];

          console.log("++++++++++++++++++ Targer ++++++++++++++++++++++" + [employees[i], employees[j]]);

          for (var k = 0; k < meeting_schedule.length; k++) {

            if (meeting_schedule[j - 1].teams.length === 0) {
              meeting_schedule[j - 1].teams.push([employees[i], employees[j]]);
              result.meeting_date = meeting_schedule[j - 1].meeting_date;
              break;
            } else {

              console.log("k :" + k);
              var l = k;
              if (last_pointer + k >= meeting_schedule.length) {
                last_pointer = 0;
                l = 0;
                k = 0;
              }
              console.log("last pointer :" + last_pointer);
              l = l + last_pointer;
              console.log("l :" + l);

              var found = false;


              for (var tmp = 0; tmp < meeting_schedule[l].teams.length; tmp++) {
                found = meeting_schedule[l].teams[tmp].some(r => [employees[i], employees[j]].includes(r));
                if (found) {
                  break;
                }
              }

              if (!found) {
                console.log("****** Target Inserted ******" + [employees[i], employees[j]]);
                meeting_schedule[l].teams.push([employees[i], employees[j]]);
                result.meeting_date = meeting_schedule[l].meeting_date;
                last_pointer = l + 1;
                break;
              }

              console.log("+++++++++++++++++++++++++++++++++");

            }

          }
          meetings.push(result);

        }
      }

   /*   var individual_meetings_calender=[]

      for (let i = 0; i < employees.length; i++) {
  
          individual_calender={};
          individual_calender.seq=i+1;;
          individual_calender.person=employees[i];
          individual_calender.meeting_calender=[];
          for(let k=0;k<meetings.length;k++){
              
              if(meetings[k].team.includes(employees[i])){
                  individual_calender.meeting_calender.push({"contact_person":meetings[k].team.filter(r=>r != employees[i])[0],"meeting_date":meetings[k].meeting_date});
              }
          }
  
          individual_meetings_calender.push(individual_calender);
      }*/

      //Delete Previous generated schedule


      fetch(`${BASE_API_URL}/meetings_calender`)
        .then(response => response.json())
        .then(schedules => {
          // Iterate over each employee and delete them
          const deletePromises = schedules.map(schedule => {
            return fetch(`${BASE_API_URL}/meetings_calender/${schedule.id}`, {
              method: 'DELETE'
            });
          });

          // Wait for all delete requests to finish
          return Promise.all(deletePromises);
        })
        .then(() => {
          // Add new schedules
          meeting_schedule.forEach(schedule => {
            fetch(`${BASE_API_URL}/meetings_calender`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(schedule)
            });
          });
        })
        .catch(err => {
          console.error('Error deleting employees:', err);
        });


        var individual_meetings_calender=[]

        for (let i = 0; i < employees.length; i++) {
    
            individual_calender={};
            individual_calender.seq=i+1;;
            individual_calender.person=employees[i];
            individual_calender.meeting_calender=[];
            for(let k=0;k<meetings.length;k++){
                
                if(meetings[k].team.includes(employees[i])){
                    individual_calender.meeting_calender.push({"contact_person":meetings[k].team.filter(r=>r != employees[i])[0],"meeting_date":meetings[k].meeting_date});
                }
            }
    
            individual_meetings_calender.push(individual_calender);
        }


      //Delete Previous generated Individual meetings calender

      fetch(`${BASE_API_URL}/individual_meetings_calender`)
      .then(response => response.json())
      .then(schedules => {
        // Iterate over each employee and delete them
        const deletePromises = schedules.map(schedule => {
          return fetch(`${BASE_API_URL}/individual_meetings_calender/${schedule.id}`, {
            method: 'DELETE'
          });
        });

        // Wait for all delete requests to finish
        return Promise.all(deletePromises);
      })
      .then(() => {
        // Add new schedules
        individual_meetings_calender.forEach(schedule => {
          fetch(`${BASE_API_URL}/individual_meetings_calender`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(schedule)
          });
        });
      })
      .catch(err => {
        console.error('Error deleting employees:', err);
      });

      alert('Schedule regenerated successfully!');
      window.location.href = 'meeting-details.html';

    } catch (error) {
      console.error('Error:', error);
    }
  }

  generateSchedule();
});
