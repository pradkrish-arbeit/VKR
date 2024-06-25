document.getElementById('meeting-scheduler-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const frequency = document.getElementById('frequency').value;
  const start_date = document.getElementById('start_date').value;

  async function generateSchedule() {
    try {
      // Retrieve user data from Json Server
      const response = await fetch("http://localhost:3000/users");
      const employees = await response.json();

      if (employees.length < 2) {
        alert('At least two employees are required to generate a schedule.');
        return;
      }

      meeting_schedule = [];


      for (var i = 0, j = 0; i < employees.length - 1; i++, j++) {
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

      //sort the meetings array by meeting_date

      /*   for(let i =0 ; i <meetings.length;i++){
           meetings[i].meeting_calender.sort((a,b)=>new Date(a.meeting_date) - new Date(b.meeting_date));
         } */


      //Delete Previous generated schedule

      fetch('http://localhost:3000/meetings_calender')
        .then(response => response.json())
        .then(schedules => {
          // Iterate over each employee and delete them
          const deletePromises = schedules.map(schedule => {
            return fetch(`http://localhost:3000/meetings_calender/${schedule.id}`, {
              method: 'DELETE'
            });
          });

          // Wait for all delete requests to finish
          return Promise.all(deletePromises);
        })
        .then(() => {
          // Add new schedules
          meeting_schedule.forEach(schedule => {
            fetch('http://localhost:3000/meetings_calender', {
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
