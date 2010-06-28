var twittertext = exports;


var syntax = {
    twitter: {
        mention: /(?=(^|[^a-zA-Z0-9_]))[@＠]([a-zA-Z0-9_]{1,20})(?=([^@＠]|$))/,
        url: /http:\/\/[^ ]*/i,
        hashtag: /#[a-z]+/i,
    }
};


/**
 * A tokenizer, originally from Borgar's gist: http://gist.github.com/451393.
 *
 * Accepts a string, an object of regular expressions, and an optional default
 * token type.  The string is split into a set of token's based on the syntax
 * given in the second parameter while the optional third parameter is the name
 * given to any part of the string that matches none of the syntax (defaults to
 * "unknown").
 *
 * Returns an array of token objects.
 *
 * tokenize('this is text.', {
 *     word:/\w+/,
 *     whitespace:/\s+/,
 *     punctuation:/[^\w\s]/
 * }, 'invalid');
 * result => [
 *     {token="this", type="word"},
 *     {token=" ",type="whitespace"},
 *     Object {token="is", type="word"},
 *     ...
 * ]
 */
function tokenize(string, syntax, default_token_type) {
    var string_length, result, token, tokens = [];
    while (string) {
        // Reset the current token to null.
        token = null;
        string_length = string.length;
        // Loop through each regular expression in the given syntax.
        for (var key in syntax) {
            // Match the regular expression against the current string.
            result = syntax[key].exec(string);
            // Try to choose the best match if there are several, where "best"
            // is the closest to the current starting point.
            if (result && (result.index < string_length)) {
                token = {
                    token: result[0],
                    type: key,
                    matches: result.slice(1)
                }
                string_length = result.index;
            }
        }
        if (string_length) {
            // There's text between last token and the currently matched token,
            // so push that onto the tokens stack as an "unknown" token.  If a
            // default token type was passed as a parameter, that name's used
            // for the token.
            tokens.push({
                token: string.substr(0, string_length),
                type: default_token_type || 'unknown'
            });
        }
        if (token) {
            // Push current token onto the sequence.
            tokens.push(token);
        }
        // Remove the token just found from the string and get ready to loop
        // again.
        string = string.substr(string_length + (token ? token.token.length : 0));
    }
    return tokens;
};


function Message(message) {
    this.mentions = [], this.replies = [], this.urls = [], this.hashtags = [];

    var message_tokens = tokenize(message, syntax["twitter"]);
    for (var i = 0; i < message_tokens.length; i++) {
        var message_token = message_tokens[i];
        switch (message_token.type) {
            case "mention":
                var username = message_token.token.slice(1);
                this.mentions.push(username);
                if (i == 0 || (i == 1 && message_tokens[0] == " ")) {
                    this.replies.push(username);
                }
                break;
            case "url":
                this.urls.push(message_token.token);
                break;
            case "hashtag":
                this.hashtags.push(message_token.token);
                break;
        }
    }
    return this;
};


twittertext.Message = Message;
