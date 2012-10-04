var errorMsg = {
	0 : {
		title : "Test Error Code 0.",
		description : "This is test for error code."
	}
	,1 : {
		title : "Internal Error",
		description : "There're some erro with php code"
	}
		
	// 1XXX is a general error;
	,1001 : {
		title : "Authentication Error.",
		description : "Authentication Error."
	}
	,1002 : {
		title : "User isn't online.",
		description : "Please login and try again. May be session time out or duplicate login."
	}
	,1003 :{
		title : "Username or Password is/are invalid.",
		description : "Username or Password is/are invalid."
	}
	
	// 2XXX is a Character Error;
	,2001 :{
		title : "Status point not enough",
		description : "Status point require or not enough"
	}
	,2002 :{
		title : "Unknown status",
		description : "Status name invalid"
	}
	// 3XXX is a Event Error;
	,3001 :{
		title: "Unknown Event.",
		description : "Unable to execute unknown event"
	}
	,3002 :{
		title: "Unknown Event Type.",
		description : "Unable to execute unknown event type."
	}
	
	// 4XXX is a Battle Error;
	,4001 :{
		title : "Battle session is empty",
		description : "Cannot access battle's session or battle session is invalid"
	}
	
	,4002 :{
		title : "Cannot found enemy's character information",
		description : "Enemy's character id is invalid"
	}
	
	,4003 :{
		title : "Duplicate battle request",
		description : "Battle is being process"
	}
		
	,4004 :{
		title : "Target character doesn't in valid map",
		description : "Requested character is go out of your map or in invalid map"
	}
	
	,4005 :{
		title : "Attack unknow target",
		description : "Cannot found target type"
	}
	
	,4006 :{
		title : "Connot found monster' information",
		description : "Monster's id is invalid"
	}
	
	,4007 :{
		title : "Exp calculateing error",
		description : "Cannot calculate Exp"
	}
	
	,4008 :{
		title : "Item drop error",
		description : "Cannot got item drop"
	}
	
	// 5XXX is a Map Error;
	,5001 :{
		title: "Unknown Map",
		description : "Unable to get map data."
	}
	
	//6XXX is a Item Error;
	,6001 :{
		title: "Item doesn't exist.",
		description : "Item doesn't exist or item count is zero."
	}
	,6002 :{
		title : "Unknown item manage type",
		description : "Manage item doesn't correct type or you're try to crack the item."
	}
	,6003 :{
		title : "Unknown item type",
		description : "Item type is invalid"
	}
}
