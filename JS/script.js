(function(){
	const TOP = 38, DOWN = 40
	var movTop = movDown = false
	var cnv = window.document.getElementsByTagName('canvas')[0]
	var ctx = cnv.getContext("2d")
	var jogo = false
	const DISTANCIA = 20
	var frames = null
	var pontos = [0, 0]

	var componentes = []

	//Bola do jogo

	var bola = {
		x: 0,
		y: 0,
		width: 20,
		height: 20,
		vel: 10,
		dirX: Math.floor(Math.random() * 1) - 1,
		dirY: 0,
		halfWidth: function(){
			return this.width / 2
		},
		halfHeight: function(){
			return this.height / 2
		},
		centerX: function(){
			return this.x + this.halfWidth()
		},
		centerY: function(){
			return this.y + this.halfHeight()
		}
	}

	//Barras

	var barraEsquerda = {
		x: 0,
		y: 0,
		width: 20,
		height: 150,
		vel: 5,
		halfWidth: function(){
			return this.width / 2
		},
		halfHeight: function(){
			return this.height / 2
		},
		centerX: function(){
			return this.x + this.halfWidth()
		},
		centerY: function(){
			return this.y + this.halfHeight()
		}
	}

	var barraDireita = Object.create(barraEsquerda)

	//Adicionando itens ao array de componentes

	componentes.push(barraEsquerda)
	componentes.push(barraDireita)

	//Funções

	function keyDown(){
		switch(event.keyCode){
			case TOP:
				movTop = true
				break;
			case DOWN:
				movDown = true
				break;
		}
	}

	function keyUp(){
		switch(event.keyCode){
			case TOP:
				movTop = false
				break;
			case DOWN:
				movDown = false
				break;
		}
	}

	function inicia(){
		movTop = movDown = false

		//Componentes

		barraEsquerda.x = DISTANCIA
		barraDireita.x = cnv.width - DISTANCIA - barraDireita.width

		barraEsquerda.y =  barraDireita.y = (cnv.height / 2) - (barraDireita.height / 2)

		bola.x = (cnv.width / 2) - (bola.width / 2)
		bola.y = (cnv.height / 2) - (bola.height / 2)

		bola.dirX = Math.floor(Math.random() * 1) - 1
		bola.dirY = 0

		//Variavel de controle do jogo

		jogo = true

		//Canvas e contexto

		cnv = window.document.getElementsByTagName('canvas')[0]
		ctx = cnv.getContext("2d")

		if(frames == null){
			//Pontos jogadores

			pontos = [0, 0]

			loop()
		}

		window.document.getElementById("jogadorPlacar").innerText = pontos[0]
		window.document.getElementById("CPUPlacar").innerText = pontos[1]
	}

	function colisao(r1, r2){
		var catX = r1.centerX() - r2.centerX()
		var catY = r1.centerY() - r2.centerY()

		var sumHalfWidth = r1.halfWidth() + r2.halfWidth()
		var sumHalfHeight = r1.halfHeight() + r2.halfHeight()

		if(sumHalfWidth > Math.abs(catX) && sumHalfHeight > Math.abs(catY)){
			r2.dirX *= -1
			r2.dirY = ((r2.y + r2.halfHeight()) - (r1.y + r1.halfHeight())) / 50
		}
	}

	function render(){
		ctx.clearRect(0, 0, cnv.width, cnv.height)

		ctx.fillStyle = "#fff"

		//Desenhando barras

		for(let item of componentes){
			ctx.fillRect(item.x, item.y, item.width, item.height)
		}

		//Desenhando barra

		ctx.fillRect(bola.x, bola.y, bola.width, bola.height)
	}

	function update(){
		//Movimentação barra

		if(movTop){
			barraEsquerda.y -= barraEsquerda.vel
		}

		if(movDown){
			barraEsquerda.y += barraEsquerda.vel
		}

		barraEsquerda.y = Math.max(0, Math.min(barraEsquerda.y, (cnv.height - barraEsquerda.height)))

		//Movimentação bola

		bola.x += bola.vel * bola.dirX
		bola.y += bola.vel * bola.dirY

		//Verificando colisão da bola com as barras

		for(let item of componentes){
			colisao(item, bola)
		}

		//Verificando colisão da bola com as paredes

		if(bola.y < 0){
			bola.y = 0
			bola.dirY *= -1
		}

		if((bola.y + bola.height) > cnv.height){
			bola.y = (cnv.height - bola.height)
			bola.dirY *= -1
		}

		//Verificando colisão com o fundo

		if(bola.x < 0 || (bola.x + bola.width) > cnv.width){
			jogo = false

			if((bola.x + bola.width) > cnv.width) pontos[0]++
			else pontos[1]++

			inicia()
		}

		CPU()
	}

	function CPU(){
		if((bola.x + bola.width) > (cnv.width / 2) && bola.dirX > 0){
			if((bola.y + bola.halfHeight()) < (barraDireita.y + barraDireita.halfHeight()))
				barraDireita.y -= barraDireita.vel
			else if((bola.y + bola.halfHeight()) > (barraDireita.y + barraDireita.halfHeight()))
				barraDireita.y += barraDireita.vel
		}

		barraDireita.y = Math.max(0, Math.min(barraDireita.y, (cnv.height - barraDireita.height)))
	}

	function loop(){
		if(jogo){
			render()
			update()
		}

		frames = window.requestAnimationFrame(loop, cnv)
	}

	//Eventos

	window.addEventListener("load", inicia)
	window.addEventListener("keyup", keyUp)
	window.addEventListener("keydown", keyDown)
}())