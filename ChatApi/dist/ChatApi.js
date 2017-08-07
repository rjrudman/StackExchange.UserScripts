define("ChatApi", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChatApi = (function () {
        function ChatApi(chatUrl) {
            if (chatUrl === void 0) { chatUrl = 'https://chat.stackoverflow.com'; }
            this.chatRoomUrl = "" + chatUrl;
        }
        ChatApi.prototype.GetChannelFKey = function (roomId) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                $.ajax(_this.chatRoomUrl + "/rooms/" + roomId, {
                    method: 'GET'
                }).done(function (data, textStatus, jqXHR) {
                    var fkey = data.match(/hidden" value="([\dabcdef]{32})/)[1];
                    resolve(fkey);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    reject({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
                });
            });
        };
        ChatApi.prototype.SendMessage = function (roomId, message, fkey) {
            var _this = this;
            var fkeyPromise;
            if (!fkey) {
                fkeyPromise = this.GetChannelFKey(roomId);
            }
            else {
                fkeyPromise = Promise.resolve(fkey);
            }
            return fkeyPromise.then(function (fKey) {
                return new Promise(function (resolve, reject) {
                    $.ajax(_this.chatRoomUrl + "/chats/" + roomId + "/messages/new", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        data: 'text=' + encodeURIComponent(message) + '&fkey=' + fkey,
                    })
                        .done(function () { return resolve(); })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        reject({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
                    });
                });
            });
        };
        return ChatApi;
    }());
    exports.ChatApi = ChatApi;
});
