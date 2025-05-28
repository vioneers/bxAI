"use strict";

const text = "From AI seminars to hackathons, we make things happen together!";
const target = document.getElementById("typed-subtitle");
let index = 0;

function typeNextChar() {
	if (index < text.length) {
		target.insertBefore(document.createTextNode(text[index]), cursor);
		index++;
		setTimeout(typeNextChar, 30);
	} else {
		cursor.remove();
	}
}

const cursor = document.createElement("span");
cursor.className = "blinking-cursor";
target.appendChild(cursor);

typeNextChar();