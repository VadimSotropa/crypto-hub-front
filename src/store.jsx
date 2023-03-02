import { createStore } from "redux";

// Define the initial state
const initialState = {
  favorites: [],
};

// Define the reducer function
function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    default:
      return state;
  }
}

// Define the action creator function
export function addFavorite(cryptoId) {
  return { type: "ADD_FAVORITE", payload: cryptoId };
}

// Create the store
const store = createStore(favoritesReducer);

export default store;