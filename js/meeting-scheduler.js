document.getElementById('meeting-scheduler-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const frequency_days={"daily":1,"weekly":7,"monthly":31,"yearly":365};
  const v_frequency = frequency_days[document.getElementById('frequency').value];
  const v_start_date = document.getElementById('start_date').value;
  await storeMeetingCalenderDetails(v_start_date,v_frequency)
  const response = await generateSchedule(v_start_date,v_frequency);
  
  alert('Schedule regenerated successfully!');
  window.location.href = 'meeting-details.html';
   // Final success message and redirection
});


