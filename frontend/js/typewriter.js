function typeWriter(element, text, speed = 25, callback) {
  element.innerHTML = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      if (callback) callback();
    }
  }

  type();
}

window.typeWriter = typeWriter;