var PoguesDispatcher = require('../dispatchers/pogues-dispatcher');
var PoguesConstants = require('../constants/pogues-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _language = null;
var _localDictionary;
var ActionTypes = PoguesConstants.ActionTypes;
var CHANGE_EVENT = "change";

var _dictionary = {
	phLabel: {'en': 'Enter a long name for the questionnaire', 'fr': 'Entrez un nom long pour le questionnaire'},
	phName:  {'en': 'Enter a short name for the questionnaire', 'fr': 'Entrez un nom court pour le questionnaire'},
	label: {'en': 'Long name', 'fr': 'Nom long'},
	name:  {'en': 'Short name', 'fr': 'Nom court'},
	add: {'en': 'Add', 'fr': 'Ajouter'},
	tagline: {'en': 'Questionnaire design and test', 'fr': 'Conception et test de questionnaires'},
	introduction: {'en': 'Please specify your questionnaire', 'fr': 'Veuillez spécifier votre questionnaire'},
	errorMessageQuest: {'en': 'Could not retrieve the questionnaire', 'fr': 'Impossible de récupérer le questionnaire'},
	search: {'en': 'Search', 'fr': 'Chercher'},
	inviteExisting: {'en': 'Select an existing questionnaire', 'fr': 'Sélectionner un questionnaire existant'},
	errorMessageQuestList: {'en': 'Could not retrieve questionnaire list', 'fr': 'Impossible de récupérer la liste des questionnaires'}
};

function setDictionary(language) {
	var locale = {};
	for (var k in _dictionary) {
		locale[k] = _dictionary[k][language]
	}
	_localDictionary = locale;
}

function setLanguage(language) {
	_language = language;
	setDictionary(language);
}


var DictionaryStore = assign({}, EventEmitter.prototype, {
	emitChange: function() {
		console.log('DictionaryStore emitting event', CHANGE_EVENT);
		this.emit(CHANGE_EVENT);
	},
	getDictionary: function () {
		return _localDictionary;
	},
	setLanguage: setLanguage,
	dispatcherIndex: PoguesDispatcher.register(function(payload) {
		console.log('QuestionnaireStore received dispatched payload', payload);
		var action = payload.action; // action from HandleViewAction
		switch(action.actionType) {
			case ActionTypes.LANGUAGE_CHANGED:
				//_addSequence(payload.action.spec.text);
				setLanguage(payload.action.language);
				break;

			default:
				return true;
		}
		console.log('DictionaryStore will emit change, language is', _language);
		DictionaryStore.emitChange();
		return true;
	})
});

module.exports = DictionaryStore;