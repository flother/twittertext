var twittertext = exports;
var sys = require('sys');
var url = require('url');

var syntax = {
    twitter: {
        mention: /[@＠]([a-z0-9][a-z0-9_]{0,19})(\/[\w]{1,80})?/i,
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

    var tokens = tokenize( message, syntax["twitter"], 'text' );

    var current, last, next, i = 0;
    while ( current = tokens.shift() ) {
        next = tokens[0];
        
        switch (current.type) {
            case "mention":

                // mention cannot directly follow anything ending with a \w
                // mention cannot directly follow anything beginning with an @
                if ( last && /[\w]$/i.test( last.token ) || next && /^[@＠]/i.test( next.token ) ) {
                    current.type = 'text';
                    tokens.unshift( current );
                    continue;
                }
                
                var username = current.matches[0];
                var list = current.matches[1] || '';
                this.mentions.push( username );

                if ( i === 0 || (i === 1 && last.type === 'whitespace' ) ) {
                    this.replies.push( username );
                }
                
                this.html += current.token.charAt( 0 ) + "<a class=\"tweet-url " + (list ? 'list-slug' : 'username')+ "\" href=\"http://twitter.com/" + username + list + "\">" + username + list + "</a>";
                break;
            case "url":
                var urlobj = url.parse( current.token );

                // domain names must have at least two parts, and last one must be longer than 1 char
                if ( !/\.[^\.]{2,}$/.test( urlobj.hostname ) ) {
                    current.type = 'text';
                    tokens.unshift( current );
                    continue;
                }

                // fix top level domains with postfixed garbage
                var m = /^([a-z]*)[^a-z]/i.exec( urlobj.hostname.split('.').slice(-1) );
                if ( m ) {
                    var bits = current.token.split( '.' + m[1] );
                    tokens.unshift( { token:bits.slice(1).join( '.' + m[1] ), type:'text' } );
                    current.token = bits[0] + '.' + m[1]
                    tokens.unshift( current );
                    continue;
                }
                
                this.urls.push( current.token );
                this.html += "<a href=\"" + current.token + "\">" + current.token + "</a>";
                break;
            case "hashtag":

                // FIXME: this should probably be [\w\&]
                // hashtag cannot directly follow anything ending with a [a-z] or &
                if ( last && /[a-z\&]$/i.test( last.token ) ) {
                    current.type = 'text';
                    tokens.unshift( current );
                    continue;
                }

                var hashtag = current.token;
                var tag = '#' + current.matches[0];
                this.hashtags.push( current.matches[0] );
                this.html += "<a href=\"http://twitter.com/search?q=" + encodeURIComponent( tag ) + "\" title=\"" + tag + "\" class=\"tweet-url hashtag\">" + hashtag + "</a>";
                break;
            default:
                this.html += current.token;
                break;
        }

        last = current;
        i++;
    }

    return this;
};

Message.prototype.html = "";


twittertext.Message = Message;
