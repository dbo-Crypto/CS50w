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
    const ElemsContDiv = document.createElement('div');
    document.querySelector('#emails-view').append(ElemsContDiv);
    console.log("cont created")
    const DivBody = document.createElement('div');
    
    console.log("Div Body created")
    emails.forEach(element => {
      
      const ElemDiv = document.createElement('div');
      ElemDiv.setAttribute('id','mail'+element.id);
      ElemDiv.setAttribute('class','mail_item');
      ElemDiv.innerHTML =
      '<div class="row">' +   
        '<div class="col">' + 
          '<p class="sender">' + element.sender + '&emsp;' + '</p>' +
        '</div>' + 
        '<div class="col">' + 
          '<p class="subject">' + element.subject + '&emsp;' + '</p>' +
        '</div>' + 
        '<div class="col">' + 
          '<p class="body">' + element.timestamp + '</p>'+
        '</div>' + 
        '<div class="col-2">' + 
          '<button id="archive onClick="">Archive</button>'+
        '</div>' + 
      '</div>';
      
      ElemDiv.addEventListener('click', function() {
        fetch('/emails/'+element.id)
          .then(response => response.json())
          .then(email => {
              // Print email
              
              DivBody.setAttribute('id','body'+email.id);
              DivBody.setAttribute('class','mail_body');
              DivBody.innerHTML = 
                '<p class="category">' + "Sender: " +email.sender + '<br>' + '</p>' +
                '<p class="category">' + "Recipients: " +email.recipients + '<br>' + '</p>' +
                '<p class="category">' + "Subject: " +email.subject + '<br>' + '</p>' +
                '<p class="category">' + "Timestamp: " +email.timestamp + '<br>' + '</p>' +
                '<p class="category">' +email.body + '<br>' + '</p>' ;
            });
            fetch('/emails/'+element.id, {
              method: 'PUT',
              body: JSON.stringify({
                  read : true
              })
              
            })
        });
      //const button = document.getElementById("archive");
      //button.addEventListener('click', function(){
        //window.alert('button clicked');
      //});
      
      document.querySelector('#emails-view').append(ElemsContDiv);
      document.querySelector('#emails-view').append(DivBody);
      ElemsContDiv.appendChild(ElemDiv);

      console.log(element)
      console.log('mail'+element.id)
      console.log(element.read)
      if (element.read == false){
        document.getElementById('mail'+element.id).style.backgroundColor = "white";
        console.log("already false")
      } else {
        document.getElementById('mail'+element.id).style.backgroundColor = "gray";
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