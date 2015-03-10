var PoguesDispatcher = require('../dispatchers/pogues-dispatcher');
var PoguesConstants = require('../constants/pogues-constants');
var QuestionnaireListStore = require('../stores/questionnaire-list-store');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";
var ActionTypes = PoguesConstants.ActionTypes;

var _questionnaire = null;
var _modules = [];

function _setQuestionnaire(index) {
	_questionnaire = QuestionnaireListStore.getQuestionnaire(index);
	_questionnaire['modules'] = [];
}

function _removeModule(index) {
	_questionnaire['modules'].splice(index, 1);
}

function _addModule(name) {
	_questionnaire['modules'].push(_createModule(name));
}

function _createModule(name) {
	return {
		name: name
		// TODO Add other properties
	}
}

var QuestionnaireStore = assign({}, EventEmitter.prototype, {
	getQuestionnaire: function() {
		return _questionnaire;
	},
	emitChange: function() {
		console.log('QuestionnaireStore emitting event', CHANGE_EVENT);
		this.emit(CHANGE_EVENT)
	},
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback)
	},
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback)
	},
	dispatcherIndex: PoguesDispatcher.register(function(payload) {
		console.log('QuestionnaireStore received dispatched payload', payload);
		var action = payload.action; // action from HandleViewAction
		switch(action.actionType) {
			case ActionTypes.CREATE_MODULE:
				_addModule(payload.action.name);
				break;
			case ActionTypes.SELECT_EXISTING_QUESTIONNAIRE:
				_setQuestionnaire(payload.action.index);
				break;
			default:
				return true;
		}
		QuestionnaireStore.emitChange();
		return true;
	})
})

module.exports = QuestionnaireStore;