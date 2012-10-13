<?php
	function itemDetail($item_id){
		$reader = new Reader();
		$reader->commandText = 'select * from item where item_id = '.$item_id;
		if ($db = $reader->read()){
			return $db;
		} else {
			$result = new Result();
			$result->errorCode(6001);
		}
	}

	function buyItem($data){
		$result= new Result();
		$item = itemDetail($data[item_id]);
		$qty = floor(abs($data[qty]));
		$totalPrice = $item[item_price]*$qty;
		myUser()->spendMoney($totalPrice);
		$insert = new Inserter();
		$insert->table = 'character_item';
		$insert->set[character_id] = myUser('character_id');
		$insert->set[item_id] = $item[item_id];
		if ($item[item_type] == 2) {
			$insert->set[item_count] = 1;
			for ($i=0;i<$qty;$i++){
				$insert->execute();
			}
		} else {
			$reader = new Reader();
			$reader->commandText = 'select character_item_id from character_item where item_id = '.$item[item_id].' and character_id = '.myUser('character_id').' and item_sale = 0 order by character_item_id desc limit 1';
			if ($db = $reader->read()) {
				$update = new Updater();
				$update->table = 'character_item';
				$update->set[item_count] = 'item_count + '.$qty;
				$update->where[character_item_id] = $db[character_item_id];
				$update->execute();
			} else {
				$insert->set[item_count] = $qty;
				$insert->execute();	
			}
			$reader->free();
		}
		$result->set[notice][note][title] = 'ขอบคุณที่ใช้บริการ';
		$result->set[notice][note][description] = 'สิ่งของภายนอกเป็นเพียงภาพลวงตา<br/>เจ้าจงอย่ายึดติดกับของนอกกาย';
		$result -> returnData();

	}
	function item($data){
		switch($data[manage]){
			case 'use' :
				$item = new Item($data[character_item_id]);
				$item->uses(1);
				break;
			case 'drop' :
				
				break;
			default :
				$result = new Result();
				$result->errorCode(6002);
				break;
		}
	}

	function getItem(){
		$result = new Result();
		$reader = new Reader();
		$reader->commandText = 'select character_item_id,character_item.item_id,item_type,item_name,item_count,item_lv,item_active from character_item,item where character_item.item_id = item.item_id and item_count > 0 and item_sale = 0 and character_item.character_id = '.myUser('character_id');
		if ($reader->hasRow()){
			while ($db = $reader->read()){
				$result->set[character_item][] = $db;
			}
		} else {
			$result->set[character_item] = true;			
		}
		$reader->free();
		$result->returnData();
	}

	function getItemDetail($data){
		$item = new Item($data[character_item_id]);
		$item->detail(true);
	}
	
	class Item{
		var $item;
		var $character_item_id;
		function Item($character_item_id){
			$this->character_item_id = $character_item_id;
		}
		
		function detail($returnValue){
			$reader = new Reader();
			$result = new Result();
			$reader->commandText = 'select character_item_id,item_price,item_description,character_item.item_id,item_name,item_lv,item_count,item_ability,item_active,item_ability,item_type,item_position from character_item,item where character_item.item_id = item.item_id and character_item.character_id = '.myUser('character_id').' and character_item_id = '.$this->character_item_id.' and item_count >= 1 limit 1';
			if ($db = $reader->read()){
				if ($returnValue) {
					$result->set[item_detail] = $db;
					$result->returnData();	
				} else {
					$this->item = $db;
				}
				
			} else {
				$result->errorCode(6001);				
			}	
		}
		
		function existItem(){
			$reader = new Reader();
			$reader->commandText = 'select character_item_id,character_item.item_id,character_item.item_count from character_item,item where item.item_id = character_item.item_id and character_item.character_id = '.myUser('character_id').' and character_item.character_item_id = '.$this->character_item_id.' and character_item.item_count >= 1 and item_sale = 0';
			if ($db = $reader->read()){
				$this->item = $db;
				$reader->free();
				return  true;
			} else {
				$result = new Result();
				$result->errorCode(6001);
			}
		}
		
		function splice($count){
			// Splice the item count.
			$updater = new Updater();
			$updater->table = 'character_item';
			$updater->where[character_id] = myUser('character_id');
			$updater->where[character_item_id] = $this->character_item_id;
			$updater->set[item_count] = $this->item[item_count] - $count;
			$updater->execute();
		}
		
		function uses($count){
			if (!getBattleSession()){
				if ($this->existItem()){
					$this->detail(false);
					$ability = json_decode($this->item[item_ability]);
					$toUser = $_SESSION[USER];
					switch($this->item[item_type]){
						case '1' :
							//useItem
							foreach ($ability as $key => $value) {
								$toUser->character['character_'.$key] += $value;
								if (isset($toUser->character['character_max_'.$key]))  {
									if ($toUser->character['character_'.$key] > $toUser->character['character_max_'.$key]) {
										$toUser->character['character_'.$key] = $toUser->character['character_max_'.$key];
									}
								}
							}
							$toUser->save();						
							$this->splice($count); // splice item by count;		
							getItem();				
							break;
						case '2' :
							//equipItem
							$this->detail(false);
							$updater = new Updater();
							$updater->table = 'character_item';
							$updater->where[character_item_id] = $this->character_item_id;
							$updater->where[character_id] = myUser('character_id');
							if ($this->item[item_active] == 0){
								$this->unEquip($this->item[item_position]);
								$updater->set[item_active] = 1;
							} else {
								$updater->set[item_active] = 0;
							}
							$updater->execute();
							$toUser->updateStatus();
							if (isset($toUser->character['character_max_'.$key]))  {
								if ($toUser->character['character_'.$key] > $toUser->character['character_max_'.$key]) {
									$toUser->character['character_'.$key] = $toUser->character['character_max_'.$key];
								}
							}
							getItem();
							break;
						default :
							$result = new Result();
							$result->errorCode(6003);
							break;
					}
				}
			} else {
				$result = new Result();
				$result->errorCode(6004);
			}
		}
		
		function unEquip($item_position){
			$reader = new Reader();
			$reader->commandText = 'select character_item_id from character_item,item where item.item_id = character_item.item_id and character_id = '.myUser('character_id').' and item.item_position = '.$item_position.' and item_active = 1';
			if ($db = $reader->read()){
				$updater = new Updater();
				$updater->table = 'character_item';
				$updater->set[item_active] = 0;
				$updater->where[character_item_id] = $db[character_item_id];
				$updater->where[character_id] = myUser('character_id');
				$updater->execute();
			}	
		}
		
		function drops($count){
			
			$this->splice($count); // splice item by count;
		}
		
	}
?>