'use strict'

class GameObj {
	constructor (id, x, y, w) {
		this.x = x|null
		this.y = y|null
		this.w = w|null
		this.id = id|null
	}

	out () {
		return (this.x + this.w/2 < 0 || this.x - this.w/2 > window.innerWidth || this.y + this.w/2 < 0 || this.y - this.w/2 > window.innerHeight)
	}
}

class Circle extends GameObj {

	constructor (x, y, w, id, color) {
		super(id, x, y, w)
		this.rgb = color||[0,0,0,1]
		this.del = false
	}

	draw (ctx) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.w, 0, Math.PI*2, true)
		ctx.fill()
		ctx.closePath()
	}

}


class Rect extends GameObj {

	constructor (x, y, w, id, color) {
		super(id, x, y, w)
		this.rgb = color||[0,0,0,1]
		this.del = false
	}

	draw (ctx) {
		ctx.fillRect(this.x - this.w/2, this.y - this.w/2, this.w, this.w)
	}

}

let gObjs = [], gameLoop

window.onload = () => {
	add('cnv')
	cnv.width = window.innerWidth - 2
	cnv.height = window.innerHeight - 2
	let ctx = cnv.getContext('2d')

	let cnt = rnd(40,60)
	for (let i = 0; i < cnt; i++) {
		setTimeout(() => {
			createAnim()
		}, rnd(400,2000))
	}

	gameLoop = setInterval(() => {

		ctx.fillStyle = 'rgb(30,60,50)'
		ctx.fillRect(0,0,+cnv.width,+cnv.height)
		ctx.fillStyle = 'rgba(0,0,0,1)'

		for (let i = gObjs.length-1; i >= 0; i--) {
			if (!(gObjs[i] instanceof GameObj))
				continue

			if (gObjs[i].del) {
				gObjs[i].rgb[3] -= 0.025

				if (gObjs[i].rgb[3] < 0.1) {
					gObjs.splice(i,1)
					i++
					continue
				}
			}

			if (gObjs[i].out()) {
				continue
			}

			ctx.fillStyle = 'rgba('+gObjs[i].rgb.join(',')+')'
			gObjs[i].draw(ctx)
		}

	}, 50)

}

const createAnim = (x, y, dx, dy, rad, cnt) => {
	let vect = rnd(0,1)
	let dist = rnd(20,25)

	if (rnd(0,1)) {
		dist = -dist
	}

	x = x||rnd(50,cnv.width-50)
	y = y||rnd(50,cnv.height-50)
	dx = dx||(vect == 0 ? dist : 0)
	dy = dy||(vect == 1 ? dist : 0)
	rad = rad||rnd(5,8)
	cnt = cnt||rnd(8,16)

	let srct = new Circle(x, y, rad, gObjs.length, [rnd(0,100),rnd(0,100),rnd(90,255),1])
	gObjs.push(srct)
	let len = 0

	let anim = setInterval(() => {

		srct.x += (dx / (Math.abs(dx)+0.01))
		srct.y += (dy / (Math.abs(dy)+0.01))

		if ((dx != 0 && Math.abs(Math.floor(srct.x - x)) % dx == 0) || (dy != 0 && Math.abs(Math.floor(srct.y - y)) % dy == 0)) {
			let rct = new Circle(srct.x, srct.y, rad, srct.id, srct.rgb)
			gObjs.push(rct)
			len++

			if (len >= cnt) {
				for (let i = 0; i < gObjs.length; i++) {
					if (gObjs[i].id === srct.id) {
						gObjs[i].del = true
					}
				}
				createAnim()
				clearInterval(anim)
			}

			let lastColor = srct.rgb;
			srct.rgb = [100,100,100,0.7]
			srct.w += srct.w/2

			setTimeout(() => {
                if (srct.rgb[3] >= 0.7)
				    srct.rgb = lastColor
				srct.w -= srct.w/3
			}, 300)

		}

	}, 100)

}

const add = (str, name) => {
	window[name||str] = document.querySelector('#'+str)
}

const rnd = (a, b) => {
	return Math.floor(a + Math.random() * (b - a + 1))
}