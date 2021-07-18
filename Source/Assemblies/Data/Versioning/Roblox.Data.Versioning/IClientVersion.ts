export interface IClientVersion {
	/*Int64*/ ID: System.Int64 /* PK, AI */;
	/*String*/ Name: System.String /* NN */;
	/*String*/ MD5Hash: System.String /* NN */;
	/*String*/ Version: System.String /* NN */;
	/*String*/ SecurityVersion: System.String /* NN */;
	/*String*/ CDNVersion: System.String;
	/*DateTime*/ Created: System.String /* NN */;
	/*DateTime*/ Updated: System.String /* NN */;
	/*Boolean*/ UseInVersionCompatibility: System.Boolean;
}
