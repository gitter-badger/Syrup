/**
 * Created by gmena on 08-06-14.
 */

"use strict";

function Lib () {
	this.modules = {};
	this.name = null;
	this.breadcrumb = {};
	this.object = {};
}

Lib.add ( 'blend', function ( name, dependencies ) {
	var _split = _.splitString ( name, '.' );
	if ( _.isArray ( _split ) ) {
		name = _split[0];
	}

	var _self = this,
	    _anonymous = new Function (
			    'return function ' + name + '(){}'
	    );


	if ( !_.isSet ( _self.breadcrumb[name] ) ) {
		Syrup.blend ( _anonymous () );
		_self.name = name;
		_self.object = _[name];
		_self.object.name = name;
		_self.breadcrumb[name] = _self.object;
		_self.cook ( 'add', _self._mix );
		_self.cook ( 'clone', function () {
			return _[this.name];
		} );
		_self._dependencies ( dependencies );
	}
	else {
		name = _split.pop ();
		if ( !_.isSet ( _[_self.name][name] ) ) {
			_[_self.name][name] = {};
			_self.object = _[_self.name][name];
			_self.breadcrumb[name] = _self.object;
			_self._dependencies ( dependencies );
		}

	}


	return this;

} );

Lib.add ( 'get', function ( name ) {
	//console.log(this.breadcrumb)
	return this.breadcrumb[name];
} );

Lib.add ( '_dependencies', function ( dependencies ) {
	var _self = this;
	if ( _.isArray ( dependencies ) ) {
		_.each ( dependencies, function ( v ) {
			_self.object.__proto__[v] = _.isSet ( _[v] )
				? _[v] : {};
		} )
	}
} );

Lib.add ( 'make', function ( attributes ) {
	var _attributes = attributes ();
	this.object = _.extend ( this.object, _attributes );
	return this;
} );

Lib.add ( 'supply', function ( supplier ) {
	var _self = this,
	    _supplier = supplier (),
	    _k = _.getObjectKeys ( _supplier ),
	    _i = _k.length;

	while ( _i-- ) {
		if ( _.isFunction ( _supplier[_k[_i]] ) )
			_self.cook ( _k[_i], _supplier[_k[_i]] );
	}

	return this;
} );


Lib.add ( 'cook', function ( name, callback ) {
	this.object.__proto__[name] = callback;
	//this.object[name] = callback;
	return this;
} );

Lib.add ( '_mix', function ( name, callback ) {
	this.__proto__[name] = callback;
	return this;

} );


window.Lib = new Lib;
