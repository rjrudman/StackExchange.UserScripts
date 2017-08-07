define("Utilities/src/FunctionUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function GetAndCache(cacheKey, getterPromise) {
        var hasStorage = typeof (Storage) !== undefined;
        if (hasStorage) {
            var cachedItem = localStorage.getItem(cacheKey);
            if (cachedItem) {
                try {
                    var actualItem = JSON.parse(cachedItem);
                    return Promise.resolve(actualItem);
                }
                catch (error) { }
            }
        }
        getterPromise.then(function (result) {
            if (hasStorage) {
                var jsonStr = JSON.stringify(result);
                localStorage.setItem(cacheKey, jsonStr);
            }
        });
        return getterPromise;
    }
    exports.GetAndCache = GetAndCache;
});
define("NattyApi/src/NattyApi", ["require", "exports", "Utilities/src/FunctionUtils"], function (require, exports, FunctionUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var nattyFeedbackUrl = 'http://samserver.bhargavrao.com:8000/napi/api/feedback';
    function GetNattyFeedback(answerId) {
        var getterPromise = new Promise(function (resolve, reject) {
            $.ajax({
                url: nattyFeedbackUrl + "/" + answerId,
                type: 'GET',
                dataType: 'json'
            }).done(function (data, textStatus, jqXHR) {
                resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                reject({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
            });
        });
        return FunctionUtils_1.GetAndCache("NattyApi.Feedback." + answerId, getterPromise);
    }
    exports.GetNattyFeedback = GetNattyFeedback;
});
