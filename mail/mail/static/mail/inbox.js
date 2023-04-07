document.addEventListener('DOMContentLoaded', function () {

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
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;



  fetch('/emails/' + mailbox)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      const ElemsContDiv = document.createElement('div');
      document.querySelector('#emails-view').append(ElemsContDiv);
      const DivBody = document.createElement('div');

      emails.forEach(element => {
        // Display mails tat are not archived in the inbox
        
          //Create the elements to display the mails

          const ElemDiv = document.createElement('div');
          ElemDiv.setAttribute('id', 'mail' + element.id);
          ElemDiv.setAttribute('class', 'mail_item row');

          const sender = document.createElement('div');
          sender.setAttribute('class', 'col-3 child');
          sender.innerHTML =
            '<div class="col-4">' +
            '<p class="ChildText">' + element.sender + '&emsp;' + '</p>' +
            '</div>';

          const subject = document.createElement('div');
          subject.setAttribute('class', 'col-3 child');
          subject.innerHTML =
            '<div class="col">' +
            '<p class="ChildText">' + element.subject + '&emsp;' + '</p>' +
            '</div>';
          const timestamp = document.createElement('div');
          timestamp.setAttribute('class', 'col-4 child');
          timestamp.innerHTML =
            '<div class="col">' +
            '<p class="ChildText">' + element.timestamp + '&emsp;' + '</p>' +
            '</div>';

          const button = document.createElement('div');
          button.setAttribute('class', 'col-2 child');
          
          if (element.archived == false){
            button.innerHTML =
            '<button id="button"> Archive </button>';
          } else {
            button.innerHTML =
            '<button id="button"> Unarchive </button>';
          }
          

          //create each element event listener

          sender.addEventListener('click', function () {
            fetch('/emails/' + element.id)
              .then(response => response.json())
              .then(email => {
                // Print email

                view_email(element.id, mailbox);

              });
            fetch('/emails/' + element.id, {
              method: 'PUT',
              body: JSON.stringify({
                read: true
              })
            })
          });

          subject.addEventListener('click', function () {
            fetch('/emails/' + element.id)
              .then(response => response.json())
              .then(email => {
                // Print email

                view_email(element.id, mailbox);

              });
            fetch('/emails/' + element.id, {
              method: 'PUT',
              body: JSON.stringify({
                read: true
              })
            })
          });

          timestamp.addEventListener('click', function () {
            fetch('/emails/' + element.id)
              .then(response => response.json())
              .then(email => {
                // Print email

                view_email(element.id, mailbox);

              });
            fetch('/emails/' + element.id, {
              method: 'PUT',
              body: JSON.stringify({
                read: true
              })
            })
          });

          button.addEventListener('click', function () {
            fetch('/emails/' + element.id)
              .then(response => response.json())
              .then(email => {
                // Print email

                if (element.archived == false){
                  fetch('/emails/' + element.id, {
                    method: 'PUT',
                    body: JSON.stringify({
                      archived: true
                    })
                  })
                load_mailbox("archive");
                }else{
                  fetch('/emails/' + element.id, {
                    method: 'PUT',
                    body: JSON.stringify({
                      archived: false
                    })
                  })
                  load_mailbox("inbox");
                  }
              });
            
          });


          document.querySelector('#emails-view').append(ElemsContDiv);
          document.querySelector('#emails-view').append(DivBody);
          ElemsContDiv.appendChild(ElemDiv);
          ElemDiv.appendChild(sender);
          ElemDiv.appendChild(subject);
          ElemDiv.appendChild(timestamp);
          ElemDiv.appendChild(button);



          if (element.read == false) {
            document.getElementById('mail' + element.id).style.backgroundColor = "white";
          } else {
            document.getElementById('mail' + element.id).style.backgroundColor = "gray";
          }
        }
      );
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

function view_email(mail_id) {
  // Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  // Clear email-view content
  document.querySelector('#email-view').value = '';

  fetch('/emails/' + mail_id)
    .then(response => response.json())
    .then(email => {
      // Print email
      
      const DivBody = document.createElement('div');
      DivBody.setAttribute('id', 'body' + email.id);
      DivBody.setAttribute('class', 'mail_body');
      
      document.querySelector('#email-view').append(DivBody);

     
      DivBody.innerHTML =
        '<p class="category">' + "Sender: " + email.sender + '<br>' + '</p>' +
        '<p class="category">' + "Recipients: " + email.recipients + '<br>' + '</p>' +
        '<p class="category">' + "Subject: " + email.subject + '<br>' + '</p>' +
        '<p class="category">' + "Timestamp: " + email.timestamp + '<br>' + '</p>' +
        '<p class="category">' + email.body + '<br>' + '</p>' +
        '<button class="category" id="reply"> Reply </button>' +
        '<button class="category" id="return"> Return to Inbox </button>';
      document.querySelector('#reply').addEventListener('click', function () {
        reply_email(email.id);
      })
      document.querySelector('#return').addEventListener('click', function () {
        location.reload();
      })
    });
}

function reply_email(mail_id){

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  
  fetch('/emails/' + mail_id)
    .then(response => response.json())
    .then(email => {


  compose_email();
  document.querySelector('#compose-recipients').value = email.sender;
  if (email.subject.startsWith("Re:") == true) {
    document.querySelector('#compose-subject').value = email.subject;
  } else {
    document.querySelector('#compose-subject').value = "Re: " + email.subject;
  }
  document.querySelector('#compose-body').value = "On " + email.timestamp + " " + email.sender + " " + "wrote:" + " \n" + email.body;
  });
}
