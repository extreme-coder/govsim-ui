export function alert(state = {}, action) {
    switch (action.type) {
      case 'ALERT_SUCCESS':
        return {
          type: 'success',
          message: action.message
        };
      case 'ALERT_ERROR':
        return {
          type: 'danger',
          message: action.message
        };
      case 'ALERT_CLEAR':
        return {};
      default:
        return state
    }
}