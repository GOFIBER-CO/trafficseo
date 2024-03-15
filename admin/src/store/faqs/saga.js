import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { getAllFaqs, formatFaqData, getFaqByID, deleteFaqs, searchFAQ } from '../../helpers/helper';
import { FAQ_GET_ALL, FAQ_GET_ID, DELETE_FAQ, SEARCH_FAQ } from './actionTypes';
import { getFaqSuccess, getFaqByIdSucess, deleteFaqSaga, searchFaqSaga } from './actions';

function* faqGetAll() {
    try {
        let res = yield call(getAllFaqs);
        res = formatFaqData(res);
        yield put(getFaqSuccess(res));
    } catch (error) {
        console.log(error);
    }
}
function* getFaqById({ payload: { id } }) {
    try {
        let res = yield call(getFaqByID, id);
        yield put(getFaqByIdSucess(res));
    } catch (error) {
        console.log(error);
    }
}
function* deleteSingleFaq({ payload: { id } }) {
    try {
        let res = yield call(deleteFaqs, id);
        yield put(deleteFaqSaga(res));
        let allFaqs = yield call(getAllFaqs);
        allFaqs = formatFaqData(allFaqs);
        yield put(getFaqSuccess(allFaqs));
    } catch (error) {
        console.log(error);
    }
}

function* searchFaqs({ payload }) {
    try {
        let res = yield call(searchFAQ, { key: payload });
        yield put(searchFaqSaga(res));
    } catch(error) {
        console.log(error);
    }
}

export function* watchGetAllFaqs() {
    yield takeEvery(FAQ_GET_ALL, faqGetAll);
    yield takeEvery(FAQ_GET_ID, getFaqById);
    yield takeEvery(DELETE_FAQ, deleteSingleFaq);
    yield takeEvery(SEARCH_FAQ, searchFaqs);
}

function* faqSaga() {
    yield all([fork(watchGetAllFaqs)]);
}

export default faqSaga;