
var GameBoard = function(options) {
	this.options = {
		 game: null
		,element: null
	};

	this.options = $.extend(this.options, options);
	for (var key in this.options) {
		this[key] = this.options[key];
	}
	this.options = undefined;
	delete this.options;
};
GameBoard.prototype = {
	gameboard: '<style>.grain { fill:yellow; background-color:yellow; fill:url(#grainPattern) !important}\
					  .sheep {fill:rgb(142,233,138) !important; background-color:rgb(142,233,138) ; fill:url(#sheepPattern) !important}\
					  .wood {fill:green !important; background-color:green; fill:url(#woodPattern) !important}\
					  .ore {fill:gray !important; background-color:gray; fill:url(#orePattern) !important}\
					  .brick {fill:rgb(255, 143, 68) !important; background-color:rgb(255, 143, 68); fill:url(#brickPattern) !important}\
					  .water {fill:blue !important; background-color:blue; fill:url(#waterPattern)}\
					  .desert {fill:rgb(247,252,194) !important; background-color:yellow; fill:url(#desertPattern) !important}</style>\
					  <svg width="80%" height="80%" viewBox="0 0 576 686.892119797275" xmlns="http://www.w3.org/2000/svg" version="1.1"> <defs xmlns="http://www.w3.org/2000/svg"> <pattern id="desertPattern" patternUnits="objectBoundingBox" width="1" height="1"><image xlink:href="/images/games/Catan/desert.jpg" x="0" y="0" width="150" height="150"/> </pattern> <pattern id="grainPattern" patternUnits="objectBoundingBox" width="1" height="1"><image xlink:href="/images/games/Catan/grain.jpg" x="0" y="0" width="325" height="325"/> </pattern> <pattern id="orePattern" patternUnits="objectBoundingBox" width="1" height="1"><image xlink:href="/images/games/Catan/ore.jpg" x="0" y="0" width="150" height="150"/> </pattern> <pattern id="woodPattern" patternUnits="objectBoundingBox" width="1" height="1"><image xlink:href="/images/games/Catan/wood.jpg" x="0" y="0" width="300" height="300"/> </pattern> <pattern id="sheepPattern" patternUnits="objectBoundingBox" width="1" height="1"><image xlink:href="/images/games/Catan/sheep.jpg" x="0" y="0" width="150" height="150"/> </pattern> <pattern id="brickPattern" patternUnits="objectBoundingBox" width="1" height="1"><image xlink:href="/images/games/Catan/brick.jpg" x="0" y="0" width="200" height="200"/> </pattern> </defs> <desc>Hex grid</desc> <g id="hexes"> <polygon id="h0" class="tile" style="fill:none;;" points="144,62.3538290724796 108.000000074612,124.707658101882 36.0000001492249,124.707658231114 0,62.3538293309447 35.9999997015502,1.72310052448665e-07 107.999999626938,-2.15387579771686e-07"/> <polygon id="h1" value="11" class="tile wood" style="fill:none;;" points="144,187.061487217439 108.000000074612,249.415316246841 36.0000001492249,249.415316376073 0,187.061487475904 35.9999997015502,124.707658317269 107.999999626938,124.707657929572"/> <polygon id="h2" value="4" class="tile brick" style="fill:none;;" points="144,311.769145362398 108.000000074612,374.1229743918 36.0000001492249,374.122974521033 0,311.769145620863 35.9999997015502,249.415316462228 107.999999626938,249.415316074531"/> <polygon id="h3" value="7" class="tile desert" style="fill:none;;" points="144,436.476803507357 108.000000074612,498.830632536759 36.0000001492249,498.830632665992 0,436.476803765822 35.9999997015502,374.122974607188 107.999999626938,374.12297421949"/> <polygon id="h4" class="tile" style="fill:none;;" points="144,561.184461652316 108.000000074612,623.538290681718 36.0000001492249,623.538290810951 0,561.184461910781 35.9999997015502,498.830632752147 107.999999626938,498.830632364449"/> <polygon id="h5" value="12" class="tile sheep" style="fill:none;;" points="252,124.707658144959 216.000000074612,187.061487174361 144.000000149225,187.061487303594 108,124.707658403424 143.99999970155,62.3538292447896 215.999999626938,62.353828857092"/> <polygon id="h6" value="6" class="tile ore" style="fill:none;;" points="252,249.415316289918 216.000000074612,311.76914531932 144.000000149225,311.769145448553 108,249.415316548383 143.99999970155,187.061487389749 215.999999626938,187.061487002051"/> <polygon id="h7" value="3" class="tile wood" style="fill:none;;" points="252,374.122974434877 216.000000074612,436.476803464279 144.000000149225,436.476803593512 108,374.122974693343 143.99999970155,311.769145534708 215.999999626938,311.76914514701"/> <polygon id="h8" value="8" class="tile brick" style="fill:none;;" points="252,498.830632579837 216.000000074612,561.184461609239 144.000000149225,561.184461738471 108,498.830632838302 143.99999970155,436.476803679667 215.999999626938,436.476803291969"/> <polygon id="h9" class="tile" style="fill:none;;" points="252,623.538290724796 216.000000074612,685.892119754198 144.000000149225,685.89211988343 108,623.538290983261 143.99999970155,561.184461824626 215.999999626938,561.184461436929"/> <polygon id="h10" value="9" class="tile grain" style="fill:none;;" points="360,62.3538290724796 324.000000074612,124.707658101882 252.000000149225,124.707658231114 216,62.3538293309447 251.99999970155,1.72310052448665e-07 323.999999626938,-2.15387579771686e-07"/> <polygon id="h11" value="5" class="tile brick" style="fill:none;;" points="360,187.061487217439 324.000000074612,249.415316246841 252.000000149225,249.415316376073 216,187.061487475904 251.99999970155,124.707658317269 323.999999626938,124.707657929572"/> <polygon id="h12" value="11" class="tile grain" style="fill:none;;" points="360,311.769145362398 324.000000074612,374.1229743918 252.000000149225,374.122974521033 216,311.769145620863 251.99999970155,249.415316462228 323.999999626938,249.415316074531"/> <polygon id="h13" value="10" class="tile sheep" style="fill:none;;" points="360,436.476803507357 324.000000074612,498.830632536759 252.000000149225,498.830632665992 216,436.476803765822 251.99999970155,374.122974607188 323.999999626938,374.12297421949"/> <polygon id="h14" value="5" class="tile ore" style="fill:none;;" points="360,561.184461652316 324.000000074612,623.538290681718 252.000000149225,623.538290810951 216,561.184461910781 251.99999970155,498.830632752147 323.999999626938,498.830632364449"/> <polygon id="h15" value="10" class="tile sheep" style="fill:none;;" points="468,124.707658144959 432.000000074612,187.061487174361 360.000000149225,187.061487303594 324,124.707658403424 359.99999970155,62.3538292447896 431.999999626938,62.353828857092"/> <polygon id="h16" value="4" class="tile wood" style="fill:none;;" points="468,249.415316289918 432.000000074612,311.76914531932 360.000000149225,311.769145448553 324,249.415316548383 359.99999970155,187.061487389749 431.999999626938,187.061487002051"/> <polygon id="h17" value="9" class="tile sheep" style="fill:none;;" points="468,374.122974434877 432.000000074612,436.476803464279 360.000000149225,436.476803593512 324,374.122974693343 359.99999970155,311.769145534708 431.999999626938,311.76914514701"/> <polygon id="h18" value="2" class="tile grain" style="fill:none;;" points="468,498.830632579837 432.000000074612,561.184461609239 360.000000149225,561.184461738471 324,498.830632838302 359.99999970155,436.476803679667 431.999999626938,436.476803291969"/> <polygon id="h19" class="tile" style="fill:none;;" points="468,623.538290724796 432.000000074612,685.892119754198 360.000000149225,685.89211988343 324,623.538290983261 359.99999970155,561.184461824626 431.999999626938,561.184461436929"/> <polygon id="h20" class="tile" style="fill:none;;" points="576,62.3538290724796 540.000000074612,124.707658101882 468.000000149225,124.707658231114 432,62.3538293309447 467.99999970155,1.72310052448665e-07 539.999999626938,-2.15387579771686e-07"/> <polygon id="h21" value="8" class="tile grain" style="fill:none;;" points="576,187.061487217439 540.000000074612,249.415316246841 468.000000149225,249.415316376073 432,187.061487475904 467.99999970155,124.707658317269 539.999999626938,124.707657929572"/> <polygon id="h22" value="3" class="tile ore" style="fill:none;;" points="576,311.769145362398 540.000000074612,374.1229743918 468.000000149225,374.122974521033 432,311.769145620863 467.99999970155,249.415316462228 539.999999626938,249.415316074531"/> <polygon id="h23" value="6" class="tile wood" style="fill:none;;" points="576,436.476803507357 540.000000074612,498.830632536759 468.000000149225,498.830632665992 432,436.476803765822 467.99999970155,374.122974607188 539.999999626938,374.12297421949"/> <polygon id="h24" class="tile" style="fill:none;;" points="576,561.184461652316 540.000000074612,623.538290681718 468.000000149225,623.538290810951 432,561.184461910781 467.99999970155,498.830632752147 539.999999626938,498.830632364449"/> </g> <g id="edges"> </g> <g id="vertices"> </g> <g id="tiles"> </g> </svg>',
	
	actions: {
		 'placeSettlement': function(board, vid, player) {
		 	Util.log('place settlement: ' + vid + '; ' + player);
			if($('#'+vid).attr('class') == 'vertex unassigned') {
				$('#'+vid).attr('class','vertex '+'player'+player);
				$('#vertices .unassigned').css('display','none');
				$('#'+vid).show();
			}
		}
		,'placeRoad': function(board, eid, player) {
			Util.log('place road: ' + eid + '; ' + player);
			if($('#'+eid).attr('class') == 'edge unassigned') {
				$('#'+eid).attr('class','edge '+ 'player'+player)
				$('#edges .unassigned').css('display','none');
				$('#'+eid).show();
			}
		}
		,'updatePlayerResources': function(board, el, player, args) {
			if (typeof args.players[board.game.playerNumber] !== 'undefined') {
				console.log('Discard ' + args.players[board.game.playerNumber] + ' cards');
			}
		}
		,'showRoll': function(board, el, player, args) {
			if (!$('#dice').length) {
				board.element.append('<input type="button" id="dice" />');
			}
			$('#dice').val(args.value);
			$('#dice').fadeIn('fast');
			if (board.timeout) {
				clearTimeout(board.timeout);
			}
			board.timeout = setTimeout(function() {
				$('#dice').fadeOut('slow');
			}, 3000);
		}
		,'endTurn': function(board, el, player, args) {
			Util.log('endTurn: next player ' + player);
			board.game.activePlayer = player;
			board.game.state = args.state;
			board.interval = args.interval;
			$('.player' + board.game.activePlayer).addClass('player-turn');
			if (board.game.playerNumber === player) {
				board.startPlayerTurn();
			} else {
				//disable build controls
				board.disableBuildControls();
				if ($('#dice')) {
					$('#dice').fadeOut('fast');
				}
				$('.player' + board.game.playerNumber).removeClass('player-turn');
			}
			if (typeof args !== 'undefined' && typeof args.lastPlayer !== 'undefined') {
				$('.player' + args.lastPlayer).removeClass('player-turn');
			}
			$('.player' + player).addClass('player-turn');
		}
	},

	render: function() {
		$(this.element).html(this.gameboard);

		this.renderActions();
		this.createVertices(); 
		this.createEdges();
		this.renderTiles();
		this.setupListeners();
	 	this.showControls();
	},

	renderActions: function() {
		$(this.game.element).append('\
			<div id="actions" class="hideActions">\
				<!--<input id="trade_button" value="Trade" type="button">\
				<input id="purchase_button" value="Purchase" type="button">-->\
				<input id="placeRoad_button" value="Road" type="button">\
				<input id="placeCity_button" value="Settlement" type="button">\
				<input id="upgradeSettle_button" value="City" type="button">\
				<input id="buyDevCard_button" value="Dev. Card" type="button">\
			</div>\
			<div id="purchase_modal" class="">\
				<input id="placeCity_button" value="Place City" type="button"/>\
				<input id="placeRoad_button" value="Place Road" type="button"/>\
				<input type="button" id="cancelPurchase_button" value="cancel"/>\
			</div>');
		var self = this;
		$('#purchase_button').click(function(){
			if(!$('#purchase_modal').hasClass('show_modal')) {
				$('#purchase_modal').addClass('show_modal')
				self.disableControls();
			}
		});
		
		$('#cancelPurchase_button').click(function(){
			$('#purchase_modal').removeClass('show_modal')
			self.enableControls();
		});

	},

	showControls: function() {
		var self = this;
		if (!$('#controls').length) { //render if doesn't exist yet
			$(this.game.element).append(' \
				<div id="controls"> \
					<input id="showHideCards_button" value="Cards" type="button" style="display:none;">\
					<input id="showActions_button" value="Actions" type="button">\
				</div>\
				<input id="endTurn_button" value="End Turn" type="button">\
				<div id="purchaseControls">\
					<input id="cancelAction_button" value="cancel" type="button">\
				</div>'
			);
			$('#showHideCards_button').click(function(){
				$('#hand').toggleClass('hideCards');
			});
			
			$('#endTurn_button').click(function(){
				self.endPlayerTurn();
			});
			
			$('#showHideCards_button').fastButton(function(){
				$('#hand').toggleClass('hideCards');
			});
			
			$('#showActions_button').click(function(){
				$('#actions').toggleClass('hideActions');
			});
			
			$('#showActions_button').fastButton(function(){
				$('#actions').toggleClass('hideActions');
			});
			
			$('#cancelAction_button').click(function(){
				self.cancelAction();
			});
			
			$('#cancelAction_button').fastButton(function(){
				self.cancelAction();
			});
		}
		$('#controls').css('display','block');
		$('#endTurn_button').css('display','block');
	},

	setupListeners: function() {
		var self = this;
		if(!Util.mobileCheck()){ //If a desktop browser, enable mouse hover to show debug info. This confuses touch events when trying to select vertex
			$('.tile').mouseover(function(){
				$('#debug').html($(this).attr('id')+" : "+$(this).attr('class'))
			})
		}
		
		$('.edge').fastButton(function(){
			self.edgeClicked(this);
		});
		$('.edge').click(function(){
			self.edgeClicked(this);
		});
		
		$('.vertex').fastButton(function(){
			self.vertexClicked(this);
		});
		$('.vertex').click(function(){
			self.vertexClicked(this);
		});
	
		$('#placeCity_button').click(function(){
			self.placeSettlement();
		});
		$('#placeCity_button').fastButton(function(){
			self.placeSettlement();
		});
	
		$('#placeRoad_button').click(function(){
			self.placeRoadMode();
		});
		$('#placeRoad_button').fastButton(function(){
			self.placeRoadMode();
		});
		
		$('#endTurn_button').click(function(){
			Util.log('not connected');
		});
		
		Util.log('set up button listeners');
		this.game.connection.on('applyAction', function(data) {
			self.actions[data.action](self, data.element, data.playerNumber, data.args);
		});
	},
	
	hideModals: function(){
		this.hideModalHack();
	},

	showPurchaseControls: function() {
		$('#purchaseControls').css('display','block');
	},
	
	hidePurchaseControls: function() {
		$('#purchaseControls').css('display','none');
	},
		
	placeSettlement: function() {
		this.hideModals();
		if (this.game.state === GameState.IDLE) {
			Util.log('Waiting for player to place settlement...')
			this.disableControls();
			
			this.showPurchaseControls();
			
			$('#vertices .unassigned').css('display','block');
			var self = this;
			this.element.on('vertexClick',function(e,vid,player){
				
				if($('#'+vid).attr('class') == 'vertex unassigned')
				{
					$('#'+vid).attr('class','vertex ' + 'player' + player);
					$('#vertices .unassigned').css('display','none');
					self.element.off('vertexClick')
					self.enableControls();
					self.hidePurchaseControls();
					$('#actions').removeClass('hideActions');

					self.game.connection.emit('doAction', {game: self.game.uniqueKey, action: 'placeSettlement', playerNumber: self.game.playerNumber, element: vid})
				
				} else {
					alert('Location already chosen, select an unassigned spot ')
				}
				
			});
		}
	},

	startPlayerTurn: function() {
		this.disableBuildControls();
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		$('#actions').addClass('hideActions');
		Util.log(this.game.state);
		if (this.game.state !== GameState.FIRST_ROUND) {
			//roll dice
			if (!$('#dice').length) {
				$(this.element).append('<input type="button" id="dice" />');
			}
			var dice = $('#dice');
			dice.removeAttr('disabled');
			dice.fadeIn('fast');
			dice.val('Roll');
			var self = this;
			dice.click(function() {
				if (!dice.attr('disabled') && dice.is(':visible')) {
					dice.val();
					dice.attr('disabled', 'disabled');
					var result = 0;
					var sides = self.game.dice.sides;
					for (var i = 1; i <= self.game.dice.number; i++) {
						result += Math.floor(sides * Math.random()) + 1;
					}
					dice.val(result);
					self.game.connection.emit('doAction', {
						  game: self.game.uniqueKey
						, action: 'showRoll'
						, playerNumber: self.game.activePlayer
						, args: {
							value: result
						}
					});
					if (self.timeout) {
						clearTimeout(self.timeout);
					}
					self.timeout = setTimeout(function() {
						dice.fadeOut('slow');
					}, 3000);
					
					if (result === 7) {
						//force everyone with > 7 resource cards to discard 4 or half
						var playerNumbers = {};
						for (var player in self.players) {
							var numCards = Object.keys(player.cards).length;
							if (numCards > 7) {
								playerNumbers[player] = numCards / 2;
							}
						}
						if (Object.keys(playerNumbers).length > 0) {
							self.game.connection.emit('doAction', {
								  game: self.game.uniqueKey
								, action: 'updatePlayerResources'
								, playerNumber: self.game.activePlayer
								, args: {
									players: playerNumbers
								}
							});
						}

						//active player can move the robber
						self.disableControls();
						//display message "Click a tile to move the robber."

						self.game.state = GameState.MOVING_ROBBER;

						//temp 
						self.enableControls();
					} else {
						//assign resources
						self.produceResources(result);
						self.enableControls();
						//purchase/build, trade, or play dev card loop
						self.game.state = GameState.IDLE;
					}
				}
			});
		} else {
			//First round, take turns placing 1 settlement and 1 road in snake order (1, 2, 3, 3, 2, 1)
			Util.log('Placing initial settlements');
			this.enableControls();
		}
		
	},
	
	endPlayerTurn: function() {
		this.disableBuildControls();
		$('.player' + this.game.playerNumber).removeClass('player-turn');
		if (this.game.state === GameState.FIRST_ROUND) {
			if (this.interval !== -1 && this.game.activePlayer === this.game.getLastPlayer()) {
				this.interval = -1;
				Util.log('Moving turn in reverse order ' + this.game.activePlayer);
			} else {
				if (this.interval === -1 && this.game.activePlayer === this.game.getFirstPlayer()) {
					this.game.state = GameState.IDLE;
					this.interval = 1;
				} else {
					this.game.activePlayer = this.game.getNextPlayer(this.interval);
				}
			}
		} else {
			this.game.state = GameState.IDLE;
			this.game.activePlayer = this.game.getNextPlayer();
		}
		
		this.game.connection.emit('doAction', {
			  game: this.game.uniqueKey
			, action: 'endTurn'
			, playerNumber: this.game.activePlayer
			, args: {
					 lastPlayer: this.game.playerNumber
					,interval: this.interval
					,state: this.game.state
				}
			}
		);
		
	},

	disableBuildControls: function() {
		$('#showActions_button').attr('disabled','disabled');
		$('#endTurn_button').attr('disabled','disabled');
		$('#actions').addClass('hideActions');
	},

	produceResources: function(value) {
		Util.log('Producing resources for ' + value);
	},
	
	placeRoadMode: function(){
		this.hideModals();
		if (this.game.state === GameState.IDLE) {
			Util.log('Waiting for player to place road...');
			this.disableControls();
			this.showPurchaseControls();
			$('#edges .unassigned').css('display','block');
			var self = this;	
			this.element.on('edgeClick',function(e,eid,player){
				if($('#'+eid).attr('class') == 'edge unassigned') {
					$('#'+eid).attr('class','edge '+'player'+player);
					$('#edges .unassigned').css('display','none');
					self.element.off('edgeClick');
					self.enableControls();
					self.hidePurchaseControls();
					$('#actions').removeClass('hideActions');
					
					self.game.connection.emit('doAction', {game: self.game.uniqueKey, action: 'placeRoad', playerNumber: self.game.playerNumber, element: eid});
					
				} else {
					alert('Location already chosen, select an unassigned spot ')
				}
			});
		}
	},
	
	cancelAction: function(){
		this.element.off('edgeClick');
		this.element.off('vertexClick');
		$('#edges .unassigned').css('display','none');
		$('#vertices .unassigned').css('display','none');
		this.hidePurchaseControls();
		this.enableControls();
	},
	
	disableControls: function(){
		//Use when you're asking a user to perform action
		$('#controls').css('display','none');
		$('#endTurn_button').css('display','none');
		$('#actions').addClass('hideActions');
	},
	
	enableControls: function(){
		$('#controls').css('display','block');
		$('#endTurn_button').css('display','block');
		$('#showActions_button').removeAttr('disabled');
		$('#endTurn_button').removeAttr('disabled');
	},

	/* Game Board render functions */
	renderTiles: function() {
		//--------draw tile value inside each hex
		Util.log('rendering tile values...');
		var tileCount = 0;
		var self = this;
		$('.tile').each(function(){
			if($(this).attr('value')) {
				tileCount++;
				var hexPoints = $(this).attr('points').split(' ');
				for(var p in hexPoints){
					hexPoints[p] = hexPoints[p].split(',');
					hexPoints[p][0] = parseInt(hexPoints[p][0]);
					hexPoints[p][1] = parseInt(hexPoints[p][1]);
				}
				//Util.log(hexPoints)
				var center = self.findCenterOfPolygon(hexPoints);
				//Util.log(center)
				var textColor = 'white'
				if($(this).attr('value') == 6 || $(this).attr('value') == 8) {
					textColor = 'red'
				}
				
				var tileContents = $(this).attr('value')
				if(tileContents == '7') {
					tileContents = '&#8226;'
				}
				
				//----Render off screen to get width and use it to center text
				$('#tiles').append('<text id="t'+tileCount+'" x="-1000" y="1000" fill="'+textColor+'">'+tileContents+'</text>');
				self.element.html(self.element.html()); //hack to allow jquery to render elements
				
				//Util.log($('#t"+tileCount).width())
				//Util.log(document.getElementById('t"+tileCount).getBoundingClientRect())
				
				var textDimensions = document.getElementById('t'+tileCount).getBoundingClientRect();
									
				var CONSTANT_X = parseInt(textDimensions.width / 2); //half of text width
				var CONSTANT_Y = +7; //parseInt(textDimensions.height / 2)
				
				$('#t'+tileCount).attr('x', (center[0] - CONSTANT_X)).attr('y', center[1] + CONSTANT_Y);
			}
		});
		this.element.html(this.element.html()); //hack to allow jquery to manipulate SVG elements
	
		Util.log('rendered '+tileCount+' tiles');
		
		//-------draw tile type
		//TODO Desert, water, ore, brick, wood, etc...
	},
	
	createEdges: function() {
		Util.log('generating edges...')
		
		var totalEdgesCreated = 0;
		$('.vertex').each(function(){
			var vertexI = $(this)
			$('.vertex').each(function(){
				var edgeCounter = 0;
				var vertexJ = $(this)
				
				var horizontalDistance = Math.abs(parseInt(vertexI.attr('cx')) - parseInt(vertexJ.attr('cx')))
				var verticalDistance = Math.abs(parseInt(vertexI.attr('cy')) - parseInt(vertexJ.attr('cy')))
				
				if(vertexI.attr('cy') == vertexJ.attr('cy') && horizontalDistance < 100) {
					$('#edges').append('<line id="e'+totalEdgesCreated+'" class="edge unassigned" x1="'+vertexI.attr('cx')+'" y1="'+vertexI.attr('cy')+'" x2="'+vertexJ.attr('cx')+'" y2="'+vertexJ.attr('cy')+'" />');
					edgeCounter++;
					totalEdgesCreated++;
				}
				
				if(verticalDistance > 61 && verticalDistance < 64 && horizontalDistance < 50 ) {
					$('#edges').append('<line id="e'+totalEdgesCreated+'" class="edge unassigned" x1="'+vertexI.attr('cx')+'" y1="'+vertexI.attr('cy')+'" x2="'+vertexJ.attr('cx')+'" y2="'+vertexJ.attr('cy')+'" />');
					edgeCounter++;
					totalEdgesCreated++;
				}
				
				if (edgeCounter == 3) { //vert can only have 3 connected edges so stop searching if 3 edges created
					return false;
				}
				
			});
		});
		this.element.html(this.element.html()); //hack to allow jquery to manipulate SVG elements
		
		Util.log('finished making '+totalEdgesCreated+' edges...')
		
	},
	
	createVertices: function() {
		Util.log('generating verts...')
		var vertCount = 0;
		$('.tile').each(function(){
			tid = $(this).attr('id')
			if( tid != 'h0' && tid != 'h4' && tid != 'h9' && tid != 'h19' && tid != 'h20' && tid != 'h24' ) { //ignore hidden tiles
				var tileVertsString = $(this).attr('points');
				var tileVerts = tileVertsString.split(' ');
			
				for(var v in tileVerts) {
					var xY = tileVerts[v].split(',');
					
					var duplicateVertex = false
					$('.vertex').each(function(){
						if($(this).attr('cx') == Math.round(parseFloat(xY[0])) && $(this).attr('cy') == Math.round(parseFloat(xY[1]))) {
							duplicateVertex = true;
							return false;
						}
					});
					
					if(!duplicateVertex) {
						vertCount++;
						$('#vertices').append('<circle id="v'+vertCount+'" class="vertex unassigned" cx="'+Math.round(parseFloat(xY[0]))+'" cy="'+Math.round(parseFloat(xY[1]))+'" r="15"/>');
					}
				}
			}
		});
		
		$(this).html($(this).html()); //hack to allow jquery to render SVG elements
		Util.log('finished making '+vertCount +' vertices');
	},
	
	edgeClicked: function(edgeThis) {
		Util.log($(edgeThis).attr('id'))
	
		var pNumber = this.game.playerNumber; // current player
	
		this.element.trigger('edgeClick',[$(edgeThis).attr('id'),pNumber]);
	},
	
	vertexClicked: function(vertexThis) {
		Util.log($(vertexThis).attr('id'))
	
		var pNumber = this.game.playerNumber; // current player
	
		this.element.trigger('vertexClick',[$(vertexThis).attr('id'),pNumber]);
	},
	
	//UTILITY FUNCTIONS:
	
	hideModalHack: function() {
		$('#purchase_modal').removeClass('show_modal')
	},
	
	findCenterOfPolygon: function(coords) {
		//http://stackoverflow.com/questions/16282330/find-centerpoint-of-polygon-in-javascript
		/*var coords = [
		  [ -1.2, 5.1 ],
		  [ -1.3, 5.2 ],
		  [ -1.8, 5.9 ],
		  [ -1.9, 5.8 ]
		];*/
	
		var center = function(arr){
		    var minX, maxX, minY, maxY;
		    for(var i=0; i< arr.length; i++){
		        minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
		        maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
		        minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
		        maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
		    }
		    return [(minX + maxX) /2, (minY + maxY) /2];
		}
		var c = center(coords);
		return c;	
	}
};