# QUIZ_CHAT_nodeapp

It is planned to be an Online platform where Users can join instantly without the hassle of OAuth Logins and registrations with details, Just the name and 
the email is enough!

Users can engage in challenging other users with questions where the challenger will have the control to set timer for a particular question
and send it to the challengee just like a chat message. 

The scores will be updated as and when any user sends back an answer to a non expired question.


## The backend:
* Node.js is used to script the server side to help the web app run asynchronously. 
* All the data is stored in MongoDB which includes User info, Score, Total games played
* **Firebase** integration for Login and **Socket.io** for emulating chat Like experience! 
