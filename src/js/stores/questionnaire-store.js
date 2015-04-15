var PoguesDispatcher = require('../dispatchers/pogues-dispatcher');
var PoguesConstants = require('../constants/pogues-constants');
var QuestionnaireListStore = require('../stores/questionnaire-list-store');
var QuestionnaireModel = require("../models/Questionnaire");
var SequenceModel = require("../models/Sequence");
var DataUtils = require('../utils/data-utils');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var QUtils = require('../utils/questionnaire-utils');
// FIXME CHANGE_EVENT should be a constant
var CHANGE_EVENT = "change";
var ActionTypes = PoguesConstants.ActionTypes;

var _questionnaire;
var _filter = null;
var _rFilter;

function _setQuestionnaireByIndex(index) {
  _questionnaire = QuestionnaireListStore.getQuestionnaire(index);
  console.log('Questionnaire', _questionnaire);
}
/**
 * Set current filter for the questionnaire
 * @param {String} filter Components labels will be test against filter
 */
function _setFilter(filter) {
  _filter = filter;
  // an empty string or null, no filtering
  _rFilter = filter ? new RegExp(filter) : null;
}

function _setQuestionnaire(questionnaire) {
  // We must keep id and we can keep name
  _questionnaire = questionnaire;
  console.log('Questionnaire in questionnaire store is now', _questionnaire);
}

function _createQuestionnaire(name) {
  var questionnaire = new QuestionnaireModel();
  questionnaire.name = name;
  return questionnaire;
}

function _addSequence(name) {
  var child = new SequenceModel();
  child.name = name;
  _questionnaire.addChild(child);
}

function _addComponent(spec) {
  QUtils.appendComponent(_questionnaire, spec.sequence, spec.depth, spec.text);
}

/* Mark a component (sequence or question) as editable */
function _setComponentEditable(id) {
  console.log('Component with id ' + id + ' is now editable');
  QUtils.searchAndApply(_questionnaire.children,'id', id, function(e) { console.log('ping ' + e.id + ' !'); });
}

function _updateId(newId, oldId){
  // update id only if we are still working on the current questionnaire
  if (oldId !== _questionnaire.id) return;
}

var QuestionnaireStore = assign({}, EventEmitter.prototype, {
  getQuestionnaire: function() {
    return _questionnaire;
  },
  getFilter: function () {
    return _rFilter;
  },
  emitChange: function() {
    console.log('QuestionnaireStore emitting event', CHANGE_EVENT);
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  dispatcherIndex: PoguesDispatcher.register(function(payload) {
    console.log('QuestionnaireStore received dispatched payload', payload);
    var action = payload.action; // action from HandleViewAction
    switch(action.actionType) {
      case ActionTypes.RECEIVE_NEW_ID_FROM_SERVER:
        // no action, but we want to emit change
        break;
      case ActionTypes.ADD_COMPONENT:
        //_addSequence(payload.action.spec.text);
        _addComponent(payload.action.spec);
        break;
      case ActionTypes.SELECT_QUESTIONNAIRE:
        _setQuestionnaire(payload.action.questionnaire);
        break;
      case ActionTypes.QUESTIONNAIRE_LOADED:
        // no action, but we want to emit change
        break;
      case ActionTypes.QUESTIONNAIRE_LOADING_FAILED:
        _questionnaire = null;
        break;
      case ActionTypes.EDIT_COMPONENT:
        _setComponentEditable(payload.action.id);
        break;
      case ActionTypes.FILTER_COMPONENTS:
        _setFilter(payload.action.filter);
        break;
      case ActionTypes.SAVE_QUESTIONNAIRE:
        DataUtils.saveQuestionnaire(payload.action.questionnaire);
        break;
      default:
        return true;
    }
    console.log('QuestionnaireStore will emit change, questionnaire is', _questionnaire);
    QuestionnaireStore.emitChange();
    return true;
  })
});

module.exports = QuestionnaireStore;
