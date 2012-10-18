function clearItem(){
	$('#unuseItem,#useItem,#equipItem').html('');
}
var itemZone = ["unuseItem","useItem","equipItem"];
var itemPosition = ["gloves","head","garment","righthand","body","lefthand","acc1","foots","acc2"];
function showItem(items){
	unLoad();
	clearItem();
	clearDetail();
	
	$.each(items, function(index, item) {
		
		if (item.item_active == "0"){
			itemImg = $('<img class="item-icon" />').attr('src','img/item/'+item.item_id+'.png').attr('title',item.item_name+' - '+item.item_count+' ชิ้น');
			itemCount = $('<div class="item-num"/>').html(item.item_count);
			itemHtml = $('<div class="item-icon" />').attr('id',item.character_item_id);
			itemHtml.append(itemImg).append(itemCount).appendTo('#'+itemZone[item.item_type]);
		} else if (item.item_active == "1"){
			itemImg = $('<img class="item-equip"/>').attr('src','img/item/'+item.item_id+'.png').attr('title',item.item_name).attr('id',item.character_item_id);
			//console.log(item + ' to ' +itemPosition[item.item_position-1]);
			itemImg.appendTo('#'+itemPosition[item.item_position-1]);
		}
		//console.log(JSON.stringify(item));

		
		//console.log(itemZone);
		//$('#'+itemZone).append(itemHtml);
	});
	clicks = 0;
	 $("#equipItem div.item-icon,#useItem div.item-icon").off().on("click", function(e){
		item_id = $(this).attr('id');
        clicks++;  //count clicks

        if(clicks === 1) {
            timer = setTimeout(function() {
            	clicks = 0;             //after action performed, reset counter
            	
                getDetail(item_id);          
            }, 250);

        } else {
            clearTimeout(timer);    //prevent single-click action
            clicks = 0;             //after action performed, reset counter
            manageItem('use',item_id)
           	//alert('use ' + $(item).attr('id'));
           	//useItem(id);
           	
		}
    });

	$('#unuseItem div.item-icon').off().on('click',function(){
		getDetail($(this).attr('id'))
	});
	
	$('td.equip-slot').off().on("click", function(e){
		 if ($(this).children().length>0) {
		 	item_id = $(this).children().attr('id');
	        clicks++;  //count clicks
	
	        if(clicks === 1) {
	            timer = setTimeout(function() {
	            	clicks = 0;             //after action performed, reset counter
	            	
	               getDetail(item_id);       
	            }, 250);
	
	        } else {
	            clearTimeout(timer);    //prevent single-click action
	            clicks = 0;             //after action performed, reset counter
	            manageItem('use',item_id);
	           	//alert('use ' + $(item).attr('id'));
	           	//useItem(id);
	           	
			}
		 }
    });
	
	

}

function getDetail(id){
	preLoad('.fancybox-wrap');
	action('getItemDetail',{character_item_id:id},handle);
	//refreshData.item = new Object();
	//refreshData.item.character_item_id = id;
}

function manageItem(type,id){
	preLoad('.fancybox-wrap');
	console.log(type + " : " + id);
	action('item',{manage:type,character_item_id:id},handle);
}

function clearDetail(){
	$('#item-img').css({'background':"none",'box-shadow':'none'});
	$('#item-info').html('รายละเอียดไอเท็ม');
	$('#item-name').html('ชื่อไอเท็ม');
	$('#item-mgr').html('-');
	$('.equip-slot').html('');
}

function itemDetail(data){
	unLoad();
	$('#item-img').css({
									'background':"url('img/item/"+data.item_id+".png') center no-repeat",
									'box-shadow':'0 0 20px '+itemColor[data.item_type]+' inset'
								});
	$('#item-info').html('<b>จำนวน</b> : '+data.item_count+' ชิ้น<br/><b>ราคา</b> : '+(data.item_price/2)+' ยุน<br/><b>รายละเอียด</b> :<br/>'+data.item_description);
	$('#item-name').html(data.item_name);
	if (data.item_type != 0) $('#item-mgr').html('<div class="manage use" manage="use">ใช้งาน/สวมใส่/ถอด</div><div class="manage drop" manage="drop">โยนทิ้ง</div>').attr('uid',data.character_item_id);
	$('#item-mgr .manage').off().on('click',function(){
		item_id = $(this).parent().attr('uid');
		manage_type = $(this).attr('manage');
		manageItem(manage_type,item_id);
	});
}

function buyitem(buy_item_id){
	apprise('ป้อนจำนวนที่ต้องการซื้อ', {'input':'1', 'textOk':'OK'},function(response){
		//console.log(response);
		if (response != "False") {
			response = isNumber(response);			
			if (response > 0 && response !== false){
				console.log('buy '+buy_item_id +':'+response);
				action('buyItem',{item_id:buy_item_id,qty:response},handle);	
			} else {
				load.update('กรุณากรอกจำนวนเป็นตัวเลขและมีค่ามากกว่า 0')
			}
		}
	});
}
