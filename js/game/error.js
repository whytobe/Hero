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
	
	// 5XXX is a Map Error;
	,5001 :{
		title: "Unknown Map",
		description : "Unable to get map data."
	}
}
