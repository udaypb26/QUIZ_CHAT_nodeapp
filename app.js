var mongo=require('mongodb').MongoClient;
var client=require('socket.io').listen(8011).sockets;
var body_parser=require('body-parser');
var express=require('express');
var app=express();
var path = require('path');
var body_parser=require('body-parser');


app.use(body_parser.json());

users=[];
connections=[];


//-----------------render set
app.set('view engine','jade');	
app.use(body_parser.urlencoded({extended:false}));
app.set('view options', {
    layout: false
});
app.use(express.static(path.join(__dirname, 'public')));

// routes-------------------------------------

app.get('/quiz_chat',function(req,res){


			res.render('user');
});




app.get('/dashboard',function(req,res){


	res.render('dashboard');
});


//-----------------db and stuff-----------------------------------
mongo.connect('mongodb://127.0.0.1/chat',function(err,db){
	if(err) throw err;


app.post('/user',function(req,res){

	 var username=req.body.username;
	
	var col=db.collection('messages');

//-----------check for username ---if there then dont insert else insert - using upsert:true with Update command
	col.update({'users.username':username},{$set : {"users":{
					"username":username,
					"score":null,
					"games_played":null
				}}},{upsert:true},function(err,result){


					
		console.log("inserted/updated the name %s",username);
	
	});



res.redirect('/dashboard');
});



client.on('connection',function(socket){

//pushing each socket into the array connections
	connections.push(socket);


var col=db.collection('messages');


	
	console.log('Number of connected users are : %s',connections.length);

	//popping each socket on disconnect from the connections
	socket.on('disconnect',function(data){
		

		users.splice(users.indexOf(socket.username),1);
		UpdateUsername();
				connections.splice(connections.indexOf(socket),1);
		console.log('Number of connected users are : %s',connections.length);
		client.emit('check_connected',{data:socket.username,number:connections.length});
	});

//new user----------

socket.on('new user',function(data,callback){

console.log(data);
var i=0;
var flag=true;
socket.username=data;

col.findOne({'users.username':data},function(err,item){


if(item==null)
{

	client.emit('register first');


}
else{
	for(i=0;i<users.length;i++){

		if(users[i]==socket.username){
			
			flag=false;
		}

	}

if(flag==true){
	users.push(socket.username);

}
else if(flag==false){  client.emit('already Online!');}

UpdateUsername();
}
});
});
var col_1=db.collection('questions');



socket.on('register',function(){

function foo(req,res){

	res.redirect('/quiz_chat');

}

});
//getting the question the user has selected 

socket.on('sending question',function(data,callback){

			console.log(data);
			var i=0;
			console.log('received the question!!');
			 
			
			col_1.find().toArray(function(err,data1){

				if(!err){
					for(i=0;i<data1.length;i++){
						if(data1.hidden_id==data){
						client.emit('challenge',{data:data1[i]});
						break;
					}

				}
			}
			});        //sending the question number so that it can be displayed
});


socket.on('started',function(data,callback){


console.log(data.data);
if(connections.length<=1){
	client.emit('started',"no");
}
else{
client.emit('started',data.data);
}

});
//send questions to the front end
app.get('/get_questions',function(req,res){
col_1.find().toArray(function(err,data){
	if(!err){
		var count=data.length;
		res.send(data);

		

	

}
});



});
//sending the online users to front end--------------

function UpdateUsername(){

	client.emit('get users',users);
}




	//-------------looking for data sent by any connected user:
	/*socket.on('input',function(data){
			
			
			col.insert({data:data},function(){

				console.log("inserted to mongo");

			});
		});*/

});
});

app.listen(2300);
console.log("connected!");