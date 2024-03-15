import {
    FAQ_GET_ALL,
    GET_FAQ_SUCCESS,
    FAQ_GET_ID,
    FAQ_GET_ID_SUCCESS,
    DELETE_FAQ,
    DELETE_FAQ_SAGA,
    SEARCH_FAQ,
    SEARCH_FAQ_SAGA,
} from './actionTypes';

const initialState = {
    error: '',
    success: '',
    faqList: [],
    singleFaq: {},
    deleteMesg: {}
};

const Faqs = (state = initialState, action) => {
    switch (action.type) {
        case FAQ_GET_ALL:
            state = { ...state };
            break;
        case FAQ_GET_ID:
            state = { ...state };
            break;
        case DELETE_FAQ:
            state = { ...state };
            break;
        case SEARCH_FAQ:
            state = { ...state };
            break;
        case GET_FAQ_SUCCESS:
            state = {
                ...state, faqList: action.payload
            };
            break;
        case SEARCH_FAQ_SAGA:
            state = {
                ...state, faqList: action.payload
            };
            break;
        case FAQ_GET_ID_SUCCESS:
            state = {
                ...state, singleFaq: action.payload
            };
            break;
        case DELETE_FAQ_SAGA:
            state = {
                ...state,
                deleteMesg: action.payload
            };
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
};
export default Faqs;
