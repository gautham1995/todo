var currentUser = {};




$(document).ready(function () {
    
    // on auth state change
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          $("#authentication").hide();
          $("#app_todo").show();
      
          var user = firebase.auth().currentUser;
      
          var name, email, photoUrl, uid, emailVerified;
      
          if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;
            // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            $('#user_name').text(email);
            currentUser = user;
            // writeUserData(user);
            // console.log("uid: " + currentUser.uid);
          }
          readData();
        } else {
          // No user is signed in.
          $("#authentication").show();
          $("#app_todo").hide();
        }
      });

      
// google sign in
      $("#google").click(function () {

        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            currentUser = result.user;
            console.log("logged in successfully " + currentUser);
            // ...
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
    
      });

// logout
      $("#logout_btn").click(function () {
        firebase.auth().signOut();
    });

// adding task
$("#add_todo").click(function () {
    var task_todo = $("#name_todo"). val();
    // console.log(task_todo);
    $('#name_todo').val("");
    writeUserData(task_todo);
});


function writeUserData(t) {
    var key = firebase.database().ref().child("tasks_list/"+currentUser.uid).push().key;
    firebase.database().ref().child('tasks_list/' + currentUser.uid + "/" + key).set({
      task:t,
      key: key
    });
    // console.log(t+" "+currentUser.uid + " "+ key);
    location.reload();
  }

// reading tasks
function readData(){
  var cuid;
  cuid = currentUser.uid;
  var taskRef = firebase.database().ref().child('tasks_list/' + cuid);
  taskRef.on('value', function(snapshot) {

    snapshot.forEach(function(childsnapshot){
      var item = childsnapshot.val();

      showTasks = '<div class="card"> \
      <div class="card-body"> \
        <div class="row"> \
          <div class="col-md-10"> \
            <h3 class="w-75">' + item.task + ' </h3> \
          </div> \
          <div class="col-md-2 float-right"> \
          <button type="button" class="btn btn-primary editTaskBtn" data-attri2="'+item.task+'" data-attri1="'+item.key+'" data-toggle="modal" data-target="#myModal">Edit</button> \
            <button class="btn btn-danger delete-task" id="'+ item.key +'" style="margin-left: 1em"> \
              Delete \
            </button> \
          </div> \
        </div> \
      </div> \
    </div><br>';

    $("#endRes").append(showTasks);
    // location.reload();
    console.log(item);
    });
  });
}

// deleting task
$(document).on("click", ".delete-task", function(){
  var taskId = $(this).attr('id');
  // console.log(taskId);
  // console.log(currentUser.uid);
  firebase.database().ref().child('tasks_list/'+ currentUser.uid +"/"+ taskId).remove();
  location.reload();

});

// deleting task
$(document).on("click", ".editTaskBtn", function(){
  var taskEditId = $(this).attr("data-attri1");
  var taskEditText = $(this).attr("data-attri2");
  $("#edit_todo").val(taskEditText);
  // console.log(taskEditText + " " + taskEditId);
  // location.reload();

});

});
