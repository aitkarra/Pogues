
import {
  CREATE_QUESTIONNAIRE, CREATE_QUESTIONNAIRE_FAILURE,
  CREATE_QUESTIONNAIRE_SUCCESS, EDIT_QUESTIONNAIRE, LOAD_QUESTIONNAIRE_SUCCESS,
  PUBLISH_QUESTIONNAIRE, PUBLISH_QUESTIONNAIRE_SUCCESS
} from '../actions/questionnaire'

import { COMPONENT_TYPE } from '../constants/pogues-constants'
const { QUESTION, SEQUENCE } = COMPONENT_TYPE


export const emptyQr = {
  agency: 'fr.insee',
  survey: {
    agency: 'fr.insee',
    name: 'POPO'
  },
  componentGroups: []
}

export default function (state=emptyQr, action) {
  const { type, payload } = action

  switch (type) {
    case CREATE_QUESTIONNAIRE:
      // create an empty questionnaire with the given attributes
      return {
        ...state, // empty questionnaire
        ...payload, // id, name, label
      }
    case LOAD_QUESTIONNAIRE_SUCCESS:
      //TODO check if the information about the questionnaire is consistent
      //with the information retrieve via Questionnaire List
      return {
        ...emptyQr,
        ...payload.update.questionnaire
      }
    case EDIT_QUESTIONNAIRE:
      return {
        ...state,
        label: payload.label
      }
    default:
      return state
  }
}
