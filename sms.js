window.copy = function () {
  navigator.clipboard.writeText(msg.value);
  alert("SMS copied. Ready to send!");
};
