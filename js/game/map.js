var MAP = {
	rowCount : 20,
	columnCount : 30,
	height : 32, 
	width : 32,
	blockClass : ['','move','event'],
	path : null
};

function offsetFromPosition(position){
	return {
		left : position%MAP.columnCount * MAP.width,
		top : Math.floor(position/MAP.columnCount) * MAP.height
	};
}

function positionFromOffset(offset){
	return Math.floor(offset.left/MAP.width) + (Math.floor(offset.top/MAP.height)*30);
}

function mapInitial(map_id,path){
	
	//Initial Map Canvas
	$('#mapCanvas').animate({opacity:0},function(){
    	$('#mapCanvas').attr('style','background-image:url(img/map/'+map_id+'.png);opacity:0');
	}).animate({opacity:1},1000);
	MAP.path = path;
	
	//Initial Path Canvas
	$('#pathCanvas').html(''); // Clear old canvas.
	blockCount = MAP.rowCount * MAP.columnCount;
	for (i=0;i<blockCount;i++){		
		var block = (path[i])? $('<div class="block '+MAP.blockClass[path[i]]+'" path="'+i+'"/>') : $('<div class="block"/>');
		
		//Add eventlistener to block for touch event.
		if (path[i]){
			block.click(function(){
				console.log('click @'+($(this).attr('path')));
				me.move($(this).attr('path'));
			});
		}
		
		//block.html(i);
		$('#pathCanvas').append(block);
	}
}

function calcWay(validWay,passNode,stopNode){
    stopCalc = false;
    validNode = validWay.toString().split(',');
    passNode = passNode.toString();
    nodeLength = validNode.length;
    validWay = '';
    noNode = 0;
    for (i=0;i<nodeLength;i++){
        if (stopCalc)
            break;
        lastNode = validNode[i].split('-');
        lastNodeLength = lastNode.length;
        node = lastNode[lastNodeLength-1];
        for (j=0;j<4;j++) {
            if (stopCalc)
                break;
            valid = true;
            checkNode = checkVal(node,j);
            if (MAP.path[checkNode] == 0){
                continue;
            } else if (MAP.path[checkNode] == 1 || checkNode == stopNode){
                getPassNode = passNode.split(',');
                passNodeLength = getPassNode.length;
                for (k=0;k<passNodeLength;k++){
                    if (checkNode == getPassNode[k]) {
                        valid = false;
                        break;
                    } 
                }
                if (valid) {
                    for (l =0;l<lastNodeLength;l++){
                        if (checkNode == parseInt(lastNode[l])){
                            valid = false;
                            break;
                        }
                    }
                }
                if (valid) {
                    noNode++;
                    passNode += ','+checkNode;
                    validWay += validNode[i]+'-'+checkNode+',';
                    if (checkNode == stopNode) {
                        stopCalc = true;
                    }
                }
            }
        }
    }
    if (noNode <=0){
        stopCalc = true;
    }
    validWay = validWay.substring(0,validWay.length-1);
    if (stopCalc) {
        splitValidWay = validWay.split(',');
        bestWay = splitValidWay[splitValidWay.length-1];
        return bestWay
    } else {
        return calcWay(validWay,passNode,stopNode);
    }
}

function checkVal(node,method){
	nodeOffset = [-30,-1,+1,+30];
	return parseInt(node) + nodeOffset[method];
}

