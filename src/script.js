const container = document.querySelector('#container');
const download = document.querySelector('#download');
const encodeButton = document.querySelector('#en');
const decodeButton = document.querySelector('#de');
const bk = document.querySelector('#back');
let imageFile = document.querySelector('#image');
let msg = document.querySelector('#msg');
var dataUrl;

var reader = new FileReader();
//reader.readAsDataURL(imageFile.files[0]);

imageFile.addEventListener('change', (e) => {
	reader.readAsDataURL(imageFile.files[0]);
});
reader.onload = (event) => {
	dataUrl = event.target.result;
	//console.log(dataUrl);
	img.src = dataUrl;
};
//String.fromCharCode(char)
let words = msg.value;

//====================================================
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth/2;
canvas.height = innerHeight/2;
addEventListener('resize', (e) => {
	canvas.width = innerWidth/2;
canvas.height = innerHeight/2;
});

let img = new Image();
let imgData, colors;

img.onload = () => {
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	colors = imgData.data;
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
}

function invert() {
	for (var i = 0; i < imgData.data.length; i+=4) {
		imgData.data[i] = colors[i];
		imgData.data[i+1] = colors[i+1];
		imgData.data[i+2] = colors[i+2];
		imgData.data[i+3] = 255;
	}
	ctx.putImageData(imgData, 0, 0);
}
function encode() {
	words = msg.value;
	let pos = 0;
	for (var j = 0; j < words.length; j++) {
		let char = words.charCodeAt(j).toString(2);
		if (char.length < 7) {
			
			char = 0+char;
		}
		for (var i = 0; i < char.length; i++) {
			if (parseInt(char[i], 2) > 0 && colors[(i+pos)*4]%2 == 0) {
				colors[(i+pos)*4] -= 1;
			}else if (parseInt(char[i], 2) <= 0 && colors[(i+pos)*4]%2 > 0) {
				colors[(i+pos)*4] -= 1;
			}
		}
		pos+=7;	
	}

	container.style.display = 'none';
	canvas.style.display = 'initial';
	bk.style.display = 'initial';
	invert()
}
function decode() {
	let msgBits = new Array();
	let msgChar = '0', pos = 0, decoded ='';
	for (var i = 0; i < words.length*32; i+=4) {
		if (colors[i]%2 > 0) {
			msgChar += 1;
		}else {
			msgChar += 0;
		}
		pos++;
		if (pos == 7) {
			msgBits.push(msgChar);
			msgChar = '0';
			pos = 0;
		}
	}
	for (var i = 0; i < words.length; i++) {
		decoded += String.fromCharCode(parseInt(msgBits[i],2).toString(10));
	}
	msg.value = decoded;
}
download.onclick = () => {
	var i = canvas.toDataURL("image/png");
	download.innerHTML = i;
    location.assign(i);
}
bk.onclick = () => {
	container.style.display = 'grid';
	canvas.style.display = 'none';
	bk.style.display = 'none';
}
