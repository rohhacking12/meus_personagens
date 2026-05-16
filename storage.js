// storage.js
(function() {
    var STORAGE_KEY = 'follett_characters_db';

    window.CharacterStorage = function() {
        var data = null;
        try {
            data = localStorage.getItem(STORAGE_KEY);
        } catch(e) {
            console.warn('localStorage indisponivel:', e);
            data = null;
        }
        
        try {
            this.characters = data ? JSON.parse(data) : [];
        } catch(e) {
            console.warn('Erro ao parsear dados:', e);
            this.characters = [];
        }
    };

    CharacterStorage.prototype.save = function(d) {
        if (!d.id) {
            d.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
            this.characters.push(d);
        } else {
            for (var i = 0; i < this.characters.length; i++) {
                if (this.characters[i].id === d.id) {
                    this.characters[i] = d;
                    break;
                }
            }
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.characters));
        } catch(e) {
            console.warn('Erro ao salvar no localStorage:', e);
        }
        return d;
    };

    CharacterStorage.prototype.getAll = function() {
        return this.characters;
    };

    CharacterStorage.prototype.getById = function(id) {
        for (var i = 0; i < this.characters.length; i++) {
            if (this.characters[i].id === id) return this.characters[i];
        }
        return null;
    };

    CharacterStorage.prototype.delete = function(id) {
        var next = [];
        for (var i = 0; i < this.characters.length; i++) {
            if (this.characters[i].id !== id) next.push(this.characters[i]);
        }
        this.characters = next;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.characters));
        } catch(e) {
            console.warn('Erro ao deletar:', e);
        }
    };

    console.log('storage.js carregado OK');
})();
