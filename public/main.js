$(function() {
  var FADE_TIME = 150; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var firstConnect = true;
  var $currentInput = $usernameInput.focus();

  var websocketHost = $('#websocket_host').val();
  var websocketPath = $('#websocket_path').val();
  console.log('Connecting to websocket host: ', websocketHost, websocketPath);
  var socket = io(websocketHost, {path: websocketPath});

  // Sets the client's username
  function setUsername() {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add_user', username);
    }
  }

  // Sends a chat message
  function sendMessage() {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      // tell server to execute 'new_message' and send along one parameter
      socket.emit('new_message', message);
    }
  }

  // Log a message
  function log (message, options) {
    // $('#messages').append($('<li style="background:red;">').text('disconnected'));
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement(el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput(input) {
    return $('<div/>').text(input).text();
  }

  // Gets the color of a username through our hash function
  function getUsernameColor(username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  /**
   * Keyboard events.
   */
  $window.keydown(function(event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  /**
   * Click events.
   */
  // Focus input when clicking anywhere on login page
  $loginPage.click(function() {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function() {
    $inputMessage.focus();
  });

  /**
   * Socket events.
   */
  socket.on('new_message', function(data) {
    addChatMessage(data);
  });

  socket.on('user_joined', function(data) {
    if (data.username === username) return;
    var message = data.username + ' joined from ' + data.hostname + '.';
    log(message);
  });

  socket.on('user_left', function(data) {
    var message = data.username + ' left.'
    log(message);
  });

  socket.on('hostname', function(hostname) {
    $('#websocketserver').html(hostname);
    var message = 'WebSocket connected to ' + hostname;
    log(message);
  });

  socket.on('connect', function() {
    connected = true;
    var message = 'Welcome' + (!firstConnect ? ' back' : '') + ' to Caramail';
    log(message, {
      prepend: firstConnect
    });
    firstConnect = false;
  });

  socket.on('connect_error', function() {
    connected = false;
    log('disconnected');
  });
});
