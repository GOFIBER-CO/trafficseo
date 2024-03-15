import {
    FAQ_GET_ALL,
    GET_FAQ_SUCCESS,
    FAQ_GET_ID,
    FAQ_GET_ID_SUCCESS,
    DELETE_FAQ,
    DELETE_FAQ_SAGA,
    SEARCH_FAQ,
    SEARCH_FAQ_SAGA
} from './actionTypes';

export const faqGetAll = () => {
    return {
        type: FAQ_GET_ALL
    }
};

export const getFaqSuccess = (data) => {
    return {
        type: GET_FAQ_SUCCESS,
        payload: data
    };
};

export const getFaqById = (id) => {
    return {
        type: FAQ_GET_ID,
        payload: { id }
    }
}

export const getFaqByIdSucess = (data) => {
    return {
        type: FAQ_GET_ID_SUCCESS,
        payload: data
    }
}
export const deleteFaq = (id) => {
    return {
        type: DELETE_FAQ,
        payload: { id }
    }
}

export const deleteFaqSaga = (data) => {
    return {
        type: DELETE_FAQ_SAGA,
        payload: data
    }
}

export const searchFaqSaga = (data) => {
    return {
        type: SEARCH_FAQ_SAGA,
        payload: data
    }
}

export const searchFaq = (searchText) => {
    return {
        type: SEARCH_FAQ,
        payload: searchText
    }
}