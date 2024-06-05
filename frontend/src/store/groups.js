export const SET_GROUPS = 'SET_GROUPS';
export const SET_ERROR = 'SET_ERROR';

export const setGroups = (groups) => ({
    type: SET_GROUPS,
    payload: groups,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
})

const initialState = {
    groups: [],
    error: null,
};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GROUPS:
            return {
                ...state,
                groups: action.payload,
                error: null
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default groupsReducer;
