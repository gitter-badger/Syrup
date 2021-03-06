/**
 * Created by gmena on 07-26-14.
 */

'use strict';
/**Template
 * @constructor
 */

Lib.blend ( 'Template', ['Repository', 'Ajax', 'Workers'] ).make ( function () {
	return {
		template: null
	}
} ).supply ( function () {
	return {
		lookup: function ( template, callback ) {
			var _conf = {
				url:       setting.app_path + 'templates/' + template,
				dataType:  'text/plain',
				processor: '.html'
			};

			this.Ajax.request ( _conf, function ( response ) {
				_.callbackAudit ( callback, response );
			} )
		},
		get:    function ( template, callback ) {
			var _self = this,
			    _repo = _self.Repository,
			    _template = _repo.get ( 'templates' ),
			    _save = {};

			_self.template = template;
			if ( _.isSet ( _template ) ) {
				if ( _.isSet ( _template[template] ) ) {
					_.callbackAudit ( callback, _template[template] )
				} else {
					_self.lookup ( template, function ( temp ) {
						_save[template] = temp;
						_repo.append ( 'templates', _save );
						_.callbackAudit ( callback, temp );
					} )
				}
			} else {
				_repo.set ( 'templates', {} );
				this.get ( template, callback )
			}
		},
		remove: function () {
			this.Repository.clear ( this.template );
		},
		parse:  function ( _template, _fields, callback ) {
			var _self = this;
			_self.Workers.set ( 'system/workers/setting/Parser', function () {
				_self.Workers.send ( {template: _template, fields: _fields} );
			} );

			_self.Workers.on ( 'message', function ( e ) {
				_.callbackAudit ( callback, e.data )
			} )
		}
	}

} );

