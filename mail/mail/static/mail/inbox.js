document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#submit').addEventListener('click', send_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  
  
  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    emails.forEach(element => {
      
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id','mail'+element.id);
      newDiv.setAttribute('class','mail_item');
      newDiv.innerHTML =
      '<div class="row">' +   
        '<div class="col">' + 
          '<p class="sender">' + element.sender + '&emsp;' + '</p>' +
        '</div>' + 
        '<div class="col">' + 
          '<p class="subject">' + element.subject + '&emsp;' + '</p>' +
        '</div>' + 
        '<div class="col-6">' + 
          '<p class="body">' + element.timestamp + '</p>'
        '</div>' + 
      '</div>';

      newDiv.addEventListener('click', function() {
        fetch('/emails/'+element.id)
          .then(response => response.json())
          .then(email => {
              // Print email
              const DivBody = document.createElement('div');
              DivBody.setAttribute('id','body'+email.id);
              DivBody.setAttribute('class','mail_body');
              DivBody.innerHTML = 
              '<p class="sender">' + email.body + '</p>';
              document.querySelector('#emails-view').append(newDivBody);
            });
        });
      document.querySelector('#emails-view').append(newDiv);
      console.log(element)
      console.log('mail'+element.id)
      console.log(element.read)
      if (element.read == false){
        document.getElementById('mail'+element.id).style.backgroundColor = "red";
        console.log("already false")
      } else {
        document.getElementById('mail'+element.id).style.backgroundColor = "blue";
        console.log("set to false")
      }
    });
  });
  
      
}

function send_email() {

  
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
}