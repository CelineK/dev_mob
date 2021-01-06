//code fait en L1
window.addEventListener("load", main);

let numdivs = 30; // nb de rectangles
var rects = []; // tableau de rectangles {x, y, w, h}
    
function main() {
    for (let i = 0; i < numdivs; i++) {
		let div = document.createElement("div"); // cree div 
        let rect = randRect(); // genere un rectangle aleatoire
        while(hits(rect)) rect = randRect(); // si il y a une collision, alors crée un nouveau rectangle
        rects.push(rect); // ajoute le rectangle dans le tebleau
        factory("div", rect.x, rect.y, rect.w, rect.h);
		document.body.appendChild(div); // add to body
    }
}

function randRect() { // genere un rectangle aleatoire
	let rect = {w: randRange(30, 100), h: randRange(30, 100)}; // genere la taille du rect
	Object.assign(rect, {x: randRange(0, document.body.clientWidth - rect.w), y: randRange(0, document.body.clientHeight - rect.h)}); // ajoute le coordonnees
	return rect;
}

function randRange(min, max) {
    return  Math.floor(Math.random() * (max - min + 1)) + min;
}

function hit(r1, r2) {
    return (((r1.x + r1.w >= r2.x) && (r1.x <= r2.x + r2.w)) && ((r1.y + r1.h >= r2.y) && (r1.y <= r2.y + r2.h)));
}

function hits(test) { // test de collision
	for(let rect of rects) if(hit(test, rect)) return true;
	return false;
}

function randColor() {
    return "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);
}

function factory(el, x, y, w, h) { // style du rectangle
    let element = document.createElement(el);
    element.style.position = "absolute";
    element.style.left = x + "px";
    element.style.top = y + "px";
    element.style.width = w + "px";
    element.style.height = h + "px";
    element.style.backgroundColor = randColor(); 
    document.body.appendChild(element);
}