var socketLogic = {
    __name: 'com.hifive.sample.picopico.SecketLogic',
    _socket : null,
    _SIGNAGE_EVENT : 'signage message',

    init : function(){
        this._socket = io();
    },

    sendSignage : function(msg){
        this.log.debug(msg);
        this._socket.emit(this._SIGNAGE_EVENT, msg);
    }
}
