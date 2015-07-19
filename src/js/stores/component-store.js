var PoguesDispatcher = require('../dispatchers/pogues-dispatcher');
var PoguesConstants = require('../constants/pogues-constants');
var QuestionnaireListStore = require('../stores/questionnaire-list-store');
var QuestionnaireModel = require("../models/questionnaire");
var SequenceModel = require("../models/sequence");
var DataUtils = require('../utils/data-utils');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Logger = require('../logger/logger');

var logger = new Logger('ComponentStore', 'Stores');

var CHANGE_EVENT = "change";
var ActionTypes = PoguesConstants.ActionTypes;

var _components = []

function getComponents(questionnaire, filter) {
}

function _filter(filter) {
}

function _setQuestionnaireByIndex(index) {
  _questionnaire = QuestionnaireListStore.getQuestionnaire(index);
  logger.debug('Setting questionnaire by index ' + index + ', questionnaire is: ', _questionnaire);
  _questionnaire.modules = [];
}

function _setQuestionnaire(questionnaire) {
  // We must keep id and we can keep name
  _questionnaire.modules = questionnaire.modules;
  logger.debug('Setting questionnaire in store, questionnaire is now: ', _questionnaire);
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

var ComponentStore = assign({}, EventEmitter.prototype, {
  getQuestionnaire: function() {
    return _questionnaire;
  },
  emitChange: function() {
    logger.debug('Store emitting change event');
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  dispatcherIndex: PoguesDispatcher.register(function(payload) {
    logger.debug('Received dispatched payload: ', payload);
    var action = payload.action; // action from HandleViewAction
    switch(action.actionType) {
      case ActionTypes.EDIT_COMPONENT:
        _addSequence(payload.action.name);
        break;
      default:
        return true;
    }
    logger.debug('Store will emit change, component is: ', _component);
    ComponentStore.emitChange();
    return true;
  })
});

module.exports = ComponentStore;
