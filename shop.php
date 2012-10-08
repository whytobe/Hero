<?php
	require_once 'lib/config.php';
	require_once 'lib/item.php';
	require_once 'lib/character.php'; 	
	@session_start();
?>
<!DOCTYPE html >
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/game.css">
<script src="js/vendor/jquery-1.8.0.min.js"></script>
<script src="js/plugins.js"></script>
<script src="js/main.js"></script>
<script src="js/tools.js"></script>
<script src="js/game.js"></script>
<script src="js/game/item.js"></script>
    <script type="text/javascript">
	$(document).ready(function(){
		$('#catarea .cat').on('click',function(){
    		$('#catarea .cat').removeClass('selected');
    		$(this).addClass('selected');
			$('.itemshop').show();
			cat = $(this).attr('cat');
		    if (cat !== '0'){
		    	$('.itemshop:not([position='+cat+'])').hide();
		    }
    	});
	})
	
	
</script>
</head>
<style>
tr.itemshop{
    width:500px;
    height:50px;
    max-height:50px;
    font-size:11px;
    overflow:auto;
    cursor:pointer;
}
tr.itemshop:hover{
	background-color:#FFFCE3;
	box-shadow:0 0 10px #cbcbcb inset;
}
.buy {
    border-bottom:1px #CCC solid;
    width:100px;
    
}
td.buy:hover{
	/*box-shadow:0 0 20px #FFFCE3 inset;*/
	border:3px solid #FC3;
	margin:-3px 0;
	width:94px;
    background-color:#000;
    color:#FC3;
    font-weight:bolder;
}
.shopdesc{
	 border-bottom: 1px solid #CCCCCC;
    max-width: 280px;
    padding: 5px;
    width: 280px;
    word-wrap: break-word;
}
.new{
	 background: url("img/new.png") no-repeat scroll center center transparent;
    height: 48px;
    margin-bottom: -18px;
    margin-right: -48px;
    margin-top: -30px;
    position: relative;
    width: 48px;
}
.sellImg{
	border-bottom:1px solid #CCC;
    text-align:center;
    width:100px;
}
.item {
    font-family:tahoma;
    font-size:9pt;
    color:silver;
    /*border:1px solid silver;*/
    background-color:transparent;
    width:100%;
    height:100%;
    /*max-width:300px;
    max-height:100px;*/
    overflow:auto;
    padding:0px;
    margin:0px;
}
.headitem {
    background-color:lightblue;
    /*border:double black 1px;*/
    color:white;
    font-size:13pt;
    font-weight:bold;
    padding:0px 10px;
}
.detail_main{
    width:100%;
    height:100px;
    max-height:100px;
    overflow:auto;
}
.detail_head {
    color:black;
    font:normal 9pt tahoma;
}
.detail {
    color:gray;
    font:normal 9pt tahoma;
}
.image{
    border-right:silver 1px solid;
}
.pic{
    /*width:65px;
    height:90px;*/
    max-width:140px;
    max-height:140px;
}

td.miniitem{
    width:32px;
    height:32px;
    border:gray dashed 1px;
    cursor:pointer;
}
div.miniitem{
    width:32px;
    height:32px;
    position:relative;
    left:0px;
    top:0px;
    cursor:pointer;
}
img.miniitem{
    width:32px;
    height:32px;
    cursor:pointer;
}

#shoparea{
    height:550px;
    max-height:550px;
    overflow:auto;
    text-align:center;
    vertical-align:middle;
    /*width:100%;*/
}

#catarea{
    width:20%;
    vertical-align:top;
    border-right:1px black solid;
    font-size:.8em;
}

a.cat {
    color:gray;
    display:block;
    line-height:18px;
    cursor:pointer;
}
a.cat.selected {
    display:block;
    line-height:18px;
    font-weight:bolder;
    color:white;
    background-color:gray;
}
a.cat:hover {
    font-weight:bolder;
    color:white;
    background-color:silver;
}

span.namt{
    position:absolute;
    overflow:visible;
    left:0px;
    top:0px;
    color:red;
    font-size:10px;
}
</style>

<body>
	<!--<div style="float:right;margin-top:100px;text-align:center;"><img src="img/npc/npc0001.png"/><br/>สวัสดีเจ้าหนู, อยากได้อะไรละ เลือกเอาได้เลย....</div>-->
	<div class="pageHead"><?php echo ($_GET[type]=='weapon')? 'ร้านอาวุธและชุดเกราะ' : 'ร้านขายอุปกรณ์ทั่วไป';?></div>
	<div style="margin:0 auto;text">
		<table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td id="catarea">
                	<?php if ($_GET[type]=='weapon') { ?>
	                    <a class="cat selected"  cat="0"> - ทั้งหมด</a>
	                    <a class="cat" cat="7"> - เครื่องประดับ</a>
	                    <a class="cat" cat="2"> - หมวก</a>
	                    <a class="cat" cat="4"> - อาวุธ</a>
	                    <a class="cat" cat="6"> - โล่</a>
	                    <a class="cat" cat="3"> - ผ้าคลุม</a>
	                    <a class="cat" cat="8"> - รองเท้า</a>
	                    <a class="cat" cat="5"> - ชุดเกราะ</a>
	                    <a class="cat" cat="1"> - ถุงมือ</a>
                    <? } else if ($_GET[type]=='tool'){ ?>
                    	<a class="cat selected"  cat="0"> - อุปกรณ์ทั่วไป</a>
                	<?} ?>
                </td>
                <td>
                    <div id="shoparea" class="scrolling">
                        <?php
                            itemShop($shopid);
                        ?>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    
    
</body>
</html>

<?php
function itemShop(){
		$read = new Reader();
		$read->commandText = "select item_id from shop where map_id = '".substr(myUser('map_id'), 0,6)."' and shop_type = '".$_GET[type]."'";
		$shopitem = '';
		if ($data = $read->read()){
			$shopitem = $data[item_id];
		}      
		
		$read2 = new Reader();		
		$read2->commandText = "select * from item where item_id in ($shopitem)";
		while ($db = $read2->read()){
			$itemdetail[] = $db;
		}
		$read->free();
		$read2->free();
		$position = array('-','ถุงมือ','หมวก','ผ้าคลุม','อาวุธ','ชุดเกราะ','โล่','เครื่องประดับ','รองเท้า');
		echo '<table border="0" cellspacing="0" width="100%">';
		foreach ($itemdetail as $index => $item) {
			$new = '';
			if (strtotime($item[created_date]) > mktime(0, 0, 0, date("m")  , date("d")-10, date("Y"))){
				$new = '<div class="new"></div>';
			}
			echo '<tr class="itemshop" position="'.$item[item_position].'">';
            echo "<td class='sellImg'>$new<img src='img/item/$item[item_id].png' alt='$item[item_name]'/></td>";
            echo "<td align=left valign=top class='shopdesc'><div >ชื่อ : <b>$item[item_name]</b>";
			echo "<br>ความต้องการ : <b>$item[item_require]</b>";
            echo "<br>ความสามารถ : <b>$item[item_ability]</b>";
            echo "<br>ตำแหน่ง : <b>".$position[$item[item_position]]."</b>";
			echo "<br>รายละเอียด : $item[item_description] </div></td>";
            //echo '<td align=right valign=center style="width:100px;">ชีพจร : <br>ลมปราณ : <br>ชื่อเสียง : </td>';
            //echo '<td align=center valign=center style="width:20px;"><span style="color:red">'.$usepp[0].'</span><br><span style="color:blue">'.$usesp[0].'</span><br><span style="color:green">'.$usefame[0].'</span></td>';
            echo "<td align=center valign=middle class='buy' onclick='buyitem(\"$item[item_id]\")'> ซื้อสินค้า<br>[$item[item_price] ยุน]</td>";
            echo '</tr>';
            /*echo '<tr align=center>';
            echo "<td><img src='images/items/$data[id].png' alt='$data[name]'/></td>";
            echo "<td>$data[name]</td>";
            echo "<td>$data[abillity]</td>";
            echo "<td>$data[description]</td>";
            echo "<td>ราคา $data[price] ยุน</td>";
            echo '</tr>';*/
        }
        echo '</table>';
}
?>
