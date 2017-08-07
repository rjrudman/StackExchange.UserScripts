import { GetFromCache, GroupBy, StoreInCache } from '../../Utilities/src/FunctionUtils';
import { SEApiWrapper } from './SEApiWrapper';
import { SEApiComment } from './SEApiComment';

declare var $: JQueryStatic;

const stackExchangeApiURL = '//api.stackexchange.com/2.2'

interface AnswerGrouping {
    [answerId: string]: SEApiComment[]
}

export function GetCommentsOnAnswer(answerIds: number[], site = 'stackoverflow', skipCache = false) {
    var answerThing:AnswerGrouping = {};
    if (!skipCache) {
        answerIds.forEach(answerId => {
            let cachedResult = GetFromCache(`StackExchange.Api.AnswerComments.${answerId}`)
            if (cachedResult) {
                const itemIndex = answerIds.indexOf(answerId);
                if (itemIndex > -1) {
                    answerIds.splice(itemIndex, 1);
                }
                answerThing[answerId] = cachedResult;
            }
        });
    }

    return new Promise<AnswerGrouping>((resolve, reject) => {
        if (answerIds.length > 0) {
            $.ajax({
                url: `${stackExchangeApiURL}/answers/${answerIds.join(';')}/comments?site=${site}`,
                type: 'GET',
            }).done((data: SEApiWrapper<SEApiComment>, textStatus: string, jqXHR: JQueryXHR) => {
                if (!data || !data.items) {
                    reject({jqXHR, textStatus, errorThrown: 'Null response or null items'});
                    return;
                }

                let grouping = GroupBy(data.items, i => i.post_id);
                for (var key in grouping) {
                    if (grouping.hasOwnProperty(key)) {
                        answerThing[key] = grouping[key];
                        StoreInCache(`StackExchange.Api.AnswerComments.${key}`, grouping[key]);
                    }
                }
                resolve(answerThing);
            }).fail((jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                reject({ jqXHR, textStatus, errorThrown });
            })
        } else {
            resolve(answerThing);
        }
    });
}