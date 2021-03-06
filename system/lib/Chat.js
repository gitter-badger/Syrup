/**
 * Created with JetBrains PhpStorm.
 * User: Geolffrey
 * Date: 25/11/13
 * Time: 12:22
 * To change this template use File | Settings | File Templates.
 */

'use strict';
var WARNING_CHAT = {
	ERROR: {
		NO_OBJECT: "Object Needed",
		NO_CHAT:   "Need initialize the chat"
	}
};

function Chat () {
	this.socket = new _.Socket;
	this.localUser = null;
	this.remoteUser = null;
}

Chat.add ( 'sendTo', function ( id ) {
	this.remoteUser = id;
} );

Chat.add ( 'open', function ( conf, callback ) {
	_.assert ( conf, WARNING_CHAT.ERROR.NO_OBJECT );

	this.localUser = conf.id;
	this.socket.set ( {
		                  user:     conf.id,
		                  admin:    conf.admin || 'temp',
		                  protocol: 'chat',
		                  port: !!conf.port ? conf.port : false
	                  } );

	if ( callback ) {
		callback ( true );
	}

} );

Chat.add ( 'message', function ( callback ) {
	this.socket.on ( 'message', function ( msg ) {
		var ms = JSON.parse ( msg.data );

		if ( callback ) {
			callback ( ms );
		}

	} );
} );


Chat.add ( 'send', function ( msg ) {
	_.assert ( this.localUser, WARNING_CHAT.ERROR.NO_CHAT );

	var mymsg = {};
	mymsg.to = this.remoteUser;
	mymsg.all = !mymsg.to;
	mymsg.message = msg;

	this.socket.send ( mymsg );
} );

Syrup.blend ( Chat );
