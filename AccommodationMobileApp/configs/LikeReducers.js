export default MyLikeReducers = (currentState, action) => {
    switch (action.type) {
        case "like":
            return [...currentState, action.payload];
        case "unlike":
            return currentState.filter((item) => item.id !== action.payload.id);
    }
    return currentState;
}