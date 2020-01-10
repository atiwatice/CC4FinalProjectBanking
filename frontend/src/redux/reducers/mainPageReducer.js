import {CHANGE_PAGE} from '../actions/actions'

function mainPageReducer(mainpage='homepage',action){
    switch(action.type){
        case CHANGE_PAGE:
            return {mainpage:action.mainpage}
        default:
            return mainpage
    }
}

export default mainPageReducer