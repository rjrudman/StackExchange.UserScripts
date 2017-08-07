define("Utilities/src/FunctionUtils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasStorage = typeof (Storage) !== undefined;
    function GetAndCache(cacheKey, getterPromise) {
        var cachedItem = GetFromCache(cacheKey);
        if (cachedItem) {
            return Promise.resolve(cachedItem);
        }
        getterPromise.then(function (result) { StoreInCache(cacheKey, result); });
        return getterPromise;
    }
    exports.GetAndCache = GetAndCache;
    function GetFromCache(cacheKey) {
        if (hasStorage) {
            var cachedItem = localStorage.getItem(cacheKey);
            if (cachedItem) {
                try {
                    var actualItem = JSON.parse(cachedItem);
                    return actualItem;
                }
                catch (error) { }
            }
        }
    }
    exports.GetFromCache = GetFromCache;
    function StoreInCache(cacheKey, item) {
        if (hasStorage) {
            var jsonStr = JSON.stringify(item);
            localStorage.setItem(cacheKey, jsonStr);
        }
    }
    exports.StoreInCache = StoreInCache;
    function GroupBy(collection, propertyGetter) {
        return collection.reduce(function (previousValue, currentItem) {
            (previousValue[propertyGetter(currentItem)] = previousValue[propertyGetter(currentItem)] || []).push(currentItem);
            return previousValue;
        }, {});
    }
    exports.GroupBy = GroupBy;
    ;
});
define("SEApi/src/SEApiWrapper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("SEApi/src/SEApiShallowUser", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("SEApi/src/SEApiComment", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("SEApi/src/SEApi", ["require", "exports", "Utilities/src/FunctionUtils"], function (require, exports, FunctionUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var stackExchangeApiURL = '//api.stackexchange.com/2.2';
    function GetCommentsOnAnswer(answerIds, site, skipCache) {
        if (site === void 0) { site = 'stackoverflow'; }
        if (skipCache === void 0) { skipCache = false; }
        var answerThing = {};
        if (!skipCache) {
            answerIds.forEach(function (answerId) {
                var cachedResult = FunctionUtils_1.GetFromCache("StackExchange.Api.AnswerComments." + answerId);
                if (cachedResult) {
                    var itemIndex = answerIds.indexOf(answerId);
                    if (itemIndex > -1) {
                        answerIds.splice(itemIndex, 1);
                    }
                    answerThing[answerId] = cachedResult;
                }
            });
        }
        return new Promise(function (resolve, reject) {
            if (answerIds.length > 0) {
                $.ajax({
                    url: stackExchangeApiURL + "/answers/" + answerIds.join(';') + "/comments?site=" + site,
                    type: 'GET',
                }).done(function (data, textStatus, jqXHR) {
                    if (!data || !data.items) {
                        reject({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: 'Null response or null items' });
                        return;
                    }
                    var grouping = FunctionUtils_1.GroupBy(data.items, function (i) { return i.post_id; });
                    for (var key in grouping) {
                        if (grouping.hasOwnProperty(key)) {
                            answerThing[key] = grouping[key];
                            FunctionUtils_1.StoreInCache("StackExchange.Api.AnswerComments." + key, grouping[key]);
                        }
                    }
                    resolve(answerThing);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    reject({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
                });
            }
            else {
                resolve(answerThing);
            }
        });
    }
    exports.GetCommentsOnAnswer = GetCommentsOnAnswer;
});
