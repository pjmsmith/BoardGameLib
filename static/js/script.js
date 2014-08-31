var timeout = null;

var updateUserList = function(users) {
  $('#buddylist').empty();
  for (var userId in users) {
    var userClass = '';
    if (userId === username) {
      userClass = 'class="user-self" title="This is you"';
    }
    $('#buddylist').append('<li id="' + userId + '" ' + userClass + '">' + 
      users[userId].username + '</li>');
    $('#' + userId + ':not(.user-self)').on('click', function() {
      $('#msg').val($('#msg').val() + ' ' + users[userId].username + ' ');
      $('#msg').focus();
    });
  }
  if (timeout !== null) clearTimeout(timeout);
  $('#buddylist').slideDown({queue: false});
  $('.floating-info').animate({opacity: 1, queue:false});
  $('#buddylist').animate({opacity: 1, queue:false});
  timeout = setTimeout(function() {
    $('#buddylist').slideUp({queue: false});
    $('.floating-info').animate({opacity: 0.3, queue:false});
    $('#buddylist').animate({opacity: 0.3, queue:false});
  }, 5000);
};

$(document).ready(function() {  
  document.ontouchmove = function(event) {
    if (event.target != $('#msg') && event.target != $('#send')) {
      event.preventDefault();
    }
  };

  scrollBottom($('#log'));
  
  //setup socket connection
  var socket = io.connect();
  
  //perform a command using msgHandlers or send a plain message
  var sendMessage = function() {
    var color = Color.random();
    console.log(color);
    var hasError = false;
    var msg = $('#msg').val();
    var target = null;
    var isCommand = false;
    if (msg.indexOf('/') > -1) {
      //command msg
      var cmdMsg = msg.trim();
      for (var command in msgHandlers) {
        var index = cmdMsg.indexOf('/' + command);
        if (index == 0 && typeof msgHandlers[command] !== 'undefined') {
          var params = cmdMsg.substring(index + command.length + 1).match(/\S+/g);
          var result = msgHandlers[command](params, msg, hasError);
          hasError = result.error;
          msg = result.message;
          target = result.target;
	  isCommand = true;
          break;
        }
      }
    }
    socket.emit('sendMsg', {
      color: color, 
      message: msg, 
      user: username,
      command: isCommand,
      local: hasError,
      to: target,
      from: username
    });  
    $('#msg').val('');
  }.bind(socket);

  //login
  $('#log').val('');
  socket.emit('login', {user: username});

  //choose new name if current one is taken
  socket.on('loginerror', function(data) {
    if (data.error) {
      $('#error-msg').html(data.error);
    }
    $('#chat-content').hide();
    $('#login-error').fadeIn('fast');
  });
  
  //submit on click
  $('#send').on('click', function() {
    sendMessage();  
  });
  $('#retry-login').on('click', function() {
    username = $('#new-username').val();
    $('#login-error').fadeOut('fast');
    socket.emit('login', {user: username});
  });
  
  //submit on enter
  $('#msg').keyup(function(event) {
    if ( event.which == 13 ) {
      sendMessage();
    }
  });
  $('#new-username').keyup(function(event) {
    if ( event.which == 13 ) {
      username = $('#new-username').val();
      $('#login-error').fadeOut('fast');
      socket.emit('login', {user: username});
    }
  });

  //silly events - make random colors animate on everyone's screen
  var interval;
  socket.on('dance', function() {
    interval = setInterval(function() {
      $('#colorspace').css('background-color', Color.random());
    }.bind(interval), 100);
  });
  
  socket.on('stop', function() {
    window.clearInterval(interval);
  }.bind(interval));

  //clear chat window for everyone
  socket.on('clear', function() {
    window.clearInterval(interval);
    $('#log').html('');
  }.bind(interval));
  
  //update color and display message received
  socket.on('applyColor', function(data){
    if (data.color) {
      $('#colorspace').css("background-color", data.color);
    }
    if (data.message.length) {
      var commandMsg = '';
      var msgClass = '';
      if (data.to && data.to !== data.from) {
        if (data.from == username) {
          commandMsg = 'Message to ' + data.to + ': ';
          msgClass = 'message-to';
        } else if (data.to == username) {
          commandMsg = 'Message from ' + data.from + ': ';
          msgClass = 'message-from';
        }
      }
      appendMessage(((!data.command) ? data.user + ': ' : '\u25CF ' + commandMsg) + 
        data.message, msgClass);	
    }

    $('#msg').focus();

  });
  

  //update user list when people join or leave chat
  socket.on('updatebuddies', function(data) {
    if (!$('#chat-content').is(':visible')) {
      $('#chat-content').fadeIn('fast');
      if (username === data.newUser) {
        //this should be more flexible
        var urlParts = window.location.href.split('/');
        //first two parts are http: and an empty string
        //second part is domain
        //third part is color string

        urlParts[4] = data.newUser;
        window.history.pushState({}, document.title, urlParts.join('/')); 
      }
    }
    appendMessage(data.newUser + ' has joined the chat.');
    updateUserList(data.users);
  });

  socket.on('logout', function(data) {
    appendMessage(((data.leftUser) ? data.leftUser.username : 'Someone') + ' has left the chat.');
    updateUserList(data.users);
    
  });
  

  //show and hide user list
  $('.floating-info').on('mouseenter', function() { 
    if (timeout !== null) clearTimeout(timeout);
    if (!$('#buddylist').is(':visible')) {
      $('#buddylist').slideDown({queue: false});
    }
    $('.floating-info').animate({opacity: 1, queue: false});
    $('#buddylist').animate({opacity: 1, queue: false});
  });
  $('.floating-info').on('mouseleave',function() {
    timeout = setTimeout(function() {
      if ($('#buddylist').is(':visible')) {
        $('#buddylist').stop().slideUp({queue: false})
          .animate({opacity: 0.3, queue: false});
      }
      $('.floating-info').stop().animate({opacity: 0.3, queue: false});
    }, 500);
  });

  $('#msg').focus();
});
