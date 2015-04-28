/**
 * Adds value to an array as specified by key. If an array does not exist in storage at key, a new array will be created and value will be added to the array
 * Calls callback once finished
 * @param key The key of an array in local storage
 * @param value The value to be added to the array
 * @param callback Called once the operation is completed
 */
function appendToStorage(key, value, callback) {
    chrome.storage.local.get(function(cfg) {
        if(typeof(cfg[key]) !== 'undefined' && cfg[key] instanceof Array) {
            cfg[key].push(value);
        } else {
            cfg[key] = [value];
        }
        chrome.storage.local.set(cfg);
        callback();
    });
}

/**
 * Removes an index from the array in local storage specified by key. Key must hold an array or be empty. Index must be a valid index in the array
 * @param key The key in local storage of an array
 * @param index The index to remove from the key's array
 * @param callback Called once th operation is completed
 */
function pruneFromStorage(key, index, callback) {
    chrome.storage.local.get(function(cfg) {
        if(typeof(cfg[key]) !== 'undefined' && cfg[key] instanceof Array) {
            cfg[key].splice(index, 1);
        }
        chrome.storage.local.set(cfg);
        callback();
    });
};

/**
 * Retreives the value stored by key in local storage. Calls the callback with the specified value once completed
 * @param key
 * @param callback
 */
function retrieveFromStorage(key, callback) {
    chrome.storage.local.get(key, function(value) {
        callback(value[key])
    });
}

/**
 * Determines if the searchValue exists in the array specified by key in local storage
 * @param key Must be an array in local storage
 * @param searchValue The value being searched for
 * @param callback Called once the operation is completed with true/false
 */
function existsInStorage(key, searchValue, callback) {

    retrieveFromStorage(key, function(values) {
        var contains = false;
        if(values !== undefined) {
            for(var i = 0; i < values.length; i++) {
                if(values[i] === searchValue) {
                    contains = true;
                    break;
                }
            }
        }
        callback(contains);
    });
}

function addSingleKeyToStorage(key, value, callback){
    chrome.storage.local.get(function(cfg) {
        cfg[key] = value;
        chrome.storage.local.set(cfg, callback);
    });
}

function removeSingleKeyFromStorage(key, callback){
    addSingleKeyToStorage(key, undefined, callback);
}