debugger;

import { GetCommentsOnAnswer } from '../../SEApi/src/SEApi';

let results = GetCommentsOnAnswer([18804596]);
results.then(r => console.log(r));