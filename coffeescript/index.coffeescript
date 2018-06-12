# JS practice.
# Reference：https://codepen.io/supah/pen/jqOBqp
# It's Cool ! ↑

messages = $(".messages-content")
fakeNum = 0

isTyping = true
uctTimer = null

window.userTypingClear = ->
	uctTimer = setTimeout ->
		$(".message.personal.typing").remove()
		isTyping = true
	, 3500

window.setDate = ->
	timestamp = $("<div>").addClass "timestamp"
	d = new Date()
	timestamp.text d.getHours() + ":" + (if d.getMinutes() < 10 then '0' else '') + d.getMinutes()
	timestamp.appendTo $('.message:last')

window.updateScrollbar = ->
  messages.mCustomScrollbar("update").mCustomScrollbar 'scrollTo', 'bottom', 
    scrollInertia: 10
    timeout: 0
	
fakeMsg = [
	"Hi there, I\'m Kelly and you?"
	"Nice to meet you"
	"How are you doing?"
	"Pretty good"
	"How\'s life been treating you?"
	"It could be worse, thanks"
	"I\'ve gotta go now"
	"It was a pleasure chat with you"
	"Bye :)"
]
  
window.setFakeMessage = ->
	typing = $("<div>").append("<span>").addClass "message typing"
	typing.appendTo $('.mCSB_container')
	updateScrollbar()
	setTimeout ->
		typing.remove()
		msg = $("<div>").addClass "message"
		msg.text fakeMsg[fakeNum]
		msg.appendTo $('.mCSB_container')
		setDate()
		updateScrollbar()
		fakeNum++
	, 1000 + (Math.random() * 10) * 100

window.insertMessage = ->
	msgText =  $(".action-box-input").val()
	if $.trim(msgText) == ""
		return false
	msg = $("<div>").addClass "message"
	msg.text msgText
	msg.addClass("personal").appendTo $('.mCSB_container')
	setDate()
	updateScrollbar()
	$(".action-box-input").val(null)
	
	$(".message.personal.typing").remove()
	isTyping = true
	clearTimeout uctTimer
	
	if $.trim(fakeMsg[fakeNum]) == ""
		return false
	setTimeout ->
		setFakeMessage()
	, 500 + (Math.random() * 10) * 100

$(window).on 'keydown', (e) ->
  if (e.which == 13) 
    insertMessage()
    return false

$(window).load ->
	messages.mCustomScrollbar()
	setTimeout ->
		setFakeMessage()
	, 100
	return
	
$(".action-box-input").on "keydown", (e) ->
	if $(".action-box-input") != "" && isTyping == true && e.which != 13
		typing = $("<div>").append("<span>").addClass "message personal typing"
		typing.appendTo $('.mCSB_container')
		updateScrollbar()
		isTyping = false
		userTypingClear()

