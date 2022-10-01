export const auth = (state = {auth: [], userForActivation:{} }, action) => {  
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {...state , isUserLoggedIn: true}
      case 'LOGOUT':
          return {...state , isUserLoggedIn: false}
      case 'LOGGEDIN_USER_IDENTIFIED':
          return {...state , isUserLoggedIn: true}
      case 'LOAD_USER_BY_TOKEN_SUCCESS':
          return {...state , userForActivation: action.payload.data}
      default:
        return state;
    }
};