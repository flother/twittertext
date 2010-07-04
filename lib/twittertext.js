var twittertext = exports;
var sys = require('sys');

var syntax = {
    twitter: {
        mention: /[@＠]([a-zA-Z0-9_]{1,20})(\/[\w]{1,80})?/,
        // John Gruber’s Liberal URL Regex: http://gist.github.com/249502/ - lightly modified 
        url: /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%]))(?:(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\([^\s()<>]+\)|[^`!()\[\]{};:'".,<>?«»“”‘’\s])|\/?))/i,
        hashtag: /[#＃](\d*[a-z_][\wüÀ-ÖØ-öø-ÿ]*)/i,
        //whitespace: /[\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/
        whitespace: /[\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/
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
    this.mentions = [];
    this.replies = [];
    this.urls = [];
    this.hashtags = [];

    var message_tokens = tokenize( message, syntax["twitter"], 'text' );

    for (var i = 0; i < message_tokens.length; i++) {
        var message_token = message_tokens[i];
        switch (message_token.type) {
            case "mention":
                
                // mention cannot be directly followed by anything starting with an @ char
                var next = message_tokens[ i + 1 ];
                if ( next && (next.type === 'mention' || /^[@＠]/.test( next.token )) ) {
                    message_tokens[i].type = message_tokens[i+1].type = 'text';
                    i--;
                    continue;
                }

                // FIXME: this should probably be [\w\&]
                // mention cannot directly follow anything ending with a [a-z]
                var prev = message_tokens[ i - 1 ];
                if ( prev && (/[a-z]$/i.test( prev.token )) ) {
                    message_tokens[i].type = 'text';
                    i--;
                    continue;
                }
                
                var username = message_token.matches[0];
                var list = message_token.matches[1];
                this.mentions.push( username );
                
                if ( i === 0 || (i === 1 && message_tokens[0].type === 'whitespace' ) ) {
                    this.replies.push( username );
                }
                list
                
                if ( list ) {
                  this.html += message_token.token.charAt(0) + "<a class=\"tweet-url list-slug\" href=\"http://twitter.com/" + username + list + "\">" + username + list + "</a>";
                }
                else {
                  this.html += message_token.token.charAt(0) + "<a class=\"tweet-url username\" href=\"http://twitter.com/" + username + "\">" + username + "</a>";
                }
                break;
            case "url":
                var url = message_token.token;
                
                // scheme, username, password, domain, port, path, query, anchor
                var chunker = /^(.*?):\/\/(?:([^@:]+)(?::([^@]+))?@)?([^\/?#:]+)(?::(\d+))?(\/(?:[^?#]+))?(?:\?([^#]+))?(?:#([^\s\b]*))?/;
                var m = url.match( chunker );

                // domain names must have at least two parts, and last one must be longer than 1 char
                var tld = m[4].split('.').reverse().slice(1);
                if ( !/\.[^\.]{2,}$/.test( m[4] ) ) {
                    message_tokens[i].type = 'text';
                    i--;
                    continue;
                }

                // fix top level domains with postfixed garbage
                var domain = m[1] + '://' + (m[2]||'') + (m[3]||'') + m[4].split('.').slice(0,-1);
                var tld = m[4].split('.').slice(-1)[0]||'';
                if ( (domain + '.' + tld) == url ) {
                    var s = tld.match( /^((?:xn--)?[a-z]+|[^\x00-\x80]+)(.*)$/ ); // FIXME: lowest id allowed in non-alpha url?
                    if ( s ) {
                        url = message_tokens[i].token = domain + '.' + s[1];
                        message_tokens.splice( i+1, 0, { token:s[2], type:'text' } );
                    }
                }
                
                this.urls.push(url);
                this.html += "<a href=\"" + url + "\">" + url + "</a>";
                break;
            case "hashtag":

                // FIXME: this should probably be [\w\&]
                // hashtag cannot directly follow anything ending with a [a-z] or &
                var prev = message_tokens[ i - 1 ];
                if ( prev && (/[a-z\&]$/i.test( prev.token )) ) {
                    message_tokens[i].type = 'text';
                    i--;
                    continue;
                }

                var hashtag = message_token.token;
                var tag = '#' + message_token.matches[0];
                this.hashtags.push( message_token.matches[0] );
                this.html += "<a href=\"http://twitter.com/search?q=" + encodeURIComponent( tag ) + "\" title=\"" + tag + "\" class=\"tweet-url hashtag\">" + hashtag + "</a>";
                break;
            default:
                this.html += message_token.token;
                break;
        }
    }

    return this;
};

Message.prototype.html = "";


twittertext.Message = Message;
