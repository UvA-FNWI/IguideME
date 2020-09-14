type IAction = {
  type: string;
  payload?: any;
  error?: any;
}

export default function defaultReducer(model: string, initialState: any) {
  return function(state = initialState, action: IAction) {
    switch(action.type) {
      // set fetching
      case `SET_${model}_PENDING`:
        return null;

      // return payload
      case `SET_${model}_SUCCESS`:
        return action.payload;

      // alternative to initializing the action, remove payload from store
      case `UNSET_${model}_SUCCESS`:
        return null;

      // whoopsie, the mistake is probably on you
      case `SET_${model}_ERROR`:
        return action.error || "ERROR";

      default: break;
    }

    return state;
  }
}
