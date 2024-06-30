async function getMeetingCalenderDetails (){
    // Add meeting details
    debugger
    const response = await fetch(`${BASE_API_URL}/meetings_calender_details`);
    let meeting_details = await response.json();
    return meeting_details;
  }
  
  async function storeMeetingCalenderDetails (v_start_date,v_frequency){
    // Add meeting details
    const meeting_calender_details = { "start_date": v_start_date,"frequency":v_frequency};
  
    const response2 = await fetch(`${BASE_API_URL}/meetings_calender_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meeting_calender_details)
    });
  }
  
  async function generateSchedule(v_start_date,v_frequency) {
    try {
      // Retrieve user data from Json Server
      const response = await fetch(`${BASE_API_URL}/users`);
      let employees = await response.json();
  
      employees = employees.filter(user => user.id !== 'efd8');
  
      if (employees.length < 2) {
        alert('At least two employees are required to generate a schedule.');
        return;
      }
  
      if (employees.length % 2 !== 0) {
        const No_Call = {
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
  
      let meeting_schedule = [];
  
      // Define your start_date and frequency variables as needed
      const start_date = new Date(v_start_date);
      const frequency = v_frequency; // Example value, adjust as per your requirement
  
      for (let i = 0, j = 0; i < employees.length - 1; i++, j = j + frequency) {
        debugger;
        let schedule = {};
        schedule.seq = i + 1;
        let someDate = new Date(start_date);
        someDate.setDate(someDate.getDate() + j);
  
        if (someDate.getDay() === 6) {
          someDate.setDate(someDate.getDate() + 2);
          j = j + 2;
        }
        schedule.meeting_date = someDate;
        schedule.teams = [];
        meeting_schedule.push(schedule);
      }
  
      let meetings = [];
      let count = 1;
      let last_pointer = 0;
  
      for (let i = 0; i < employees.length - 1; i++) {
        for (let j = i + 1; j < employees.length; j++) {
          let result = {};
          result.seq = count++;
          result.team = [employees[i], employees[j]];
  
          for (let k = 0; k < meeting_schedule.length; k++) {
            if (meeting_schedule[k].teams.length === 0) {
              meeting_schedule[k].teams.push([employees[i], employees[j]]);
              result.meeting_date = meeting_schedule[k].meeting_date;
              break;
            } else {
              let l = k + last_pointer;
              if (l >= meeting_schedule.length) {
                last_pointer = 0;
                l = 0;
                k = 0;
              }
  
              let found = meeting_schedule[l].teams.some(team =>
                team.some(r => [employees[i], employees[j]].includes(r))
              );
  
              if (!found) {
                meeting_schedule[l].teams.push([employees[i], employees[j]]);
                result.meeting_date = meeting_schedule[l].meeting_date;
                last_pointer = l + 1;
                break;
              }
            }
          }
          meetings.push(result);
        }
      }
  
      // Delete Previous generated schedule
      const deleteResponse = await fetch(`${BASE_API_URL}/meetings_calender`);
      const schedules = await deleteResponse.json();
  
      // Iterate over each employee and delete them
      await Promise.all(schedules.map(schedule =>
        fetch(`${BASE_API_URL}/meetings_calender/${schedule.id}`, {
          method: 'DELETE'
        })
      ));
  
      // Add new schedules
      await Promise.all(meeting_schedule.map(schedule =>
        fetch(`${BASE_API_URL}/meetings_calender`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(schedule)
        })
      ));
  
      // Generate individual_meetings_calender
      let individual_meetings_calender = [];
  
      for (let i = 0; i < employees.length; i++) {
        let individual_calender = {};
        individual_calender.seq = i + 1;
        individual_calender.person = employees[i];
        individual_calender.meeting_calender = [];
  
        for (let k = 0; k < meetings.length; k++) {
          if (meetings[k].team.includes(employees[i])) {
            individual_calender.meeting_calender.push({
              "contact_person": meetings[k].team.filter(r => r != employees[i])[0],
              "meeting_date": meetings[k].meeting_date
            });
          }
        }
  
        individual_meetings_calender.push(individual_calender);
      }
  
      // Delete Previous generated Individual meetings calender
      const deleteIndividualResponse = await fetch(`${BASE_API_URL}/individual_meetings_calender`);
      const individualSchedules = await deleteIndividualResponse.json();
  
      // Iterate over each employee and delete them
      await Promise.all(individualSchedules.map(schedule =>
        fetch(`${BASE_API_URL}/individual_meetings_calender/${schedule.id}`, {
          method: 'DELETE'
        })
      ));
  
      // Add new individual_meetings_calender schedules
      await Promise.all(individual_meetings_calender.map(schedule =>
        fetch(`${BASE_API_URL}/individual_meetings_calender`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(schedule)
        })
      ));
  
    } catch (error) {
      console.error('Error:', error);
      // Handle errors appropriately
    }
  }