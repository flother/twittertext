var twittertext = exports;
var url = require("url");


// A collection of language syntaxes used by the tokeniser.  Here we define the
// three base parts of a Twitter message: mentions, URLs, and hashtags.
var syntax = {
    twitter: {
        mention: /[@＠]([a-z0-9][a-z0-9_]{0,19})(\/[\w]{1,80})?/i,
        // Modified version of John Gruber's liberal URL regex: http://gist.github.com/249502/.
        url: /\b((?:(?:https?):(?:\/{1,3}|[a-z0-9%])|www\w*\.)(?:[^\s()<>\/]+\/(?=@)|(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\([^\s()<>]+\)|[^`!()\[\]{};:'".,<>?«»“”‘’\s@])|\/?))/i,
        hashtag: /[#＃](\d*[a-z_][\wüÀ-ÖØ-öø-ÿ]*)/i,
        whitespace: /[\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/
    }
};


/**
 * Overrideable template strings for the HTML generation.
 * Access them like this:
 *
 * twittertext.template.url = "<a class=\"link\" href=\"%(url)s\">%(title)s</a>",
 */
exports.template = Object.create({
  mention: "%(prefix)s<a class=\"tweet-url username\" href=\"http://twitter.com/%(url)s\">%(title)s</a>",
  list: "%(prefix)s<a class=\"tweet-url list-slug\" href=\"http://twitter.com/%(url)s%(name)s\">%(title)s%(name)s</a>",  
  url: "<a href=\"%(url)s\">%(title)s</a>",
  hashtag: "<a href=\"http://twitter.com/search?q=%(url)s\" title=\"%(title)s\" class=\"tweet-url hashtag\">%(name)s</a>",
});


/**
 * A tokeniser, originally from Borgar's gist: http://gist.github.com/451393.
 *
 * Accepts a string, an object of regular expressions, and an optional default
 * token type.  The string is split into a set of token's based on the syntax
 * given in the second parameter while the optional third parameter is the name
 * given to any part of the string that matches none of the syntax (defaults to
 * "unknown").
 *
 * Returns an array of token objects.
 *
 * tokenise("this is text.", {
 *     word:/\w+/,
 *     whitespace:/\s+/,
 *     punctuation:/[^\w\s]/
 * }, "invalid");
 * result => [
 *     {token="this", type="word"},
 *     {token=" ",type="whitespace"},
 *     Object {token="is", type="word"},
 *     ...
 * ]
 */
function tokenise(string, syntax, default_token_type) {
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
                type: default_token_type || "unknown"
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


/**
 * Class (or as close as Javascript gets to one) to represent a Twitter
 * message.
 *
 * On instantiation the given message is parsed for mentions (individual
 * Twitter usernames), replies (mentions at the start of the message), URLs,
 * and hashtags (strings preceeded by #).  These are all made available as
 * properties.
 */
function Message(message) {

    this.template = Object.create( exports.template );

    // Split the message into individual tokens matching the Twitter syntax
    // defined above.
    var tokens = tokenise(message, syntax["twitter"], "text");
    var processed = [];

    // Loop through the tokens, adding them to the properties (mentions,
    // replies, urls, hashtags).  The logic for each token type handles all the
    // special-cases in the tests.
    var current, last, next, i = 0;
    while (current = tokens.shift()) {
        next = tokens[0];
        switch (current.type) {

            // Parse mentions and replies.
            case "mention":
                // A mention cannot directly follow anything ending with \w.
                // A mention cannot directly follow anything beginning with @.
                if (last && /[\w]$/i.test(last.token) || next && /^[@＠]/i.test(next.token)) {
                    current.type = "text";
                    tokens.unshift(current);
                    continue;
                }
                break;

            // Parse URLs.
            case "url":
                var urlobj = url.parse(
                   /^www/i.test(current.token) ? "http://" + current.token : current.token);

                // Cut text before ampersands that don't have corresponding
                // question marks.
                var m = /^([^\?]+)(&.*)$/.exec(urlobj.href);
                if (m) {
                    tokens = tokenise(m[2], syntax["twitter"], "text").concat(tokens);
                    current.token = m[1];
                    current.matches[0] = urlobj.href;
                    tokens.unshift(current);
                    continue;
                }
                // Domain names must not follow "=", "/" or "!".
                // Domain names must not contain illegal characters.
                // Domain names must have at least two parts and the last one
                // must be longer than one character.
                if (!/(^|\.)[^\x00-\x2c\x3A-\x40\x5B-\x60\x7B-\x7F\.\/]+\.[^\.]{2,}$/.test(urlobj.hostname) ||
                        /\-\.|\.\-/.test(urlobj.hostname) ||
                        (last && /[\/!=]$/.test(last.token))) {
                    current.type = "text";
                    tokens.unshift(current);
                    continue;
                }
                // Fix top level domains with postfixed garbage.
                var m = /^([a-z]*)[^a-z]/i.exec(urlobj.hostname.split(".").slice(-1));
                if (m) {
                    var bits = current.token.split("." + m[1]);
                    tokens = tokenise(bits.slice(1).join("." + m[1]), syntax["twitter"], "text").concat(tokens);
                    current.matches[0] = current.token = bits[0] + "." + m[1];
                    tokens.unshift(current);
                    continue;
                }
                // make sure we have both the original token and the correct full url
                current.matches[0] = urlobj.href;
                break;

            // Parse hashtags.
            case "hashtag":
                // A hashtag cannot directly follow anything ending with [a-z&].
                if (last && /[\w\&]$/i.test(last.token)) {
                    current.type = "text";
                    tokens.unshift(current);
                    continue;
                }
                break;
            default:
                break;
        }

        processed.push( current );
        last = current;
        i++;
    }
    
    // grant access to the final token list
    this._getTokens = function ( type ) {
        // no filter: hand out new copy of the tokens array
        if ( !type ) return processed;
        // type specified: return values of tokens
        var ret = [];
        for (var i=0,t; t=processed[i++];) if (t.type === type) {
            ret.push( t.matches[0] );
        }
        return ret;
    };

};
Message.prototype = {
  
    template: exports.template,
  
    get urls () {
        return this._getTokens("url");
    },

    get hashtags () {
        return this._getTokens("hashtag");
    },

    get mentions () {
        return this._getTokens("mention");
    },

    get replies () {
      var ret = [],
          _1st = this._getTokens()[0],
          _2nd = this._getTokens()[1];
      if (_1st.type === "mention") {
          ret.push(_1st.matches[0]);
      }
      else if (_2nd.type === "mention" && _1st.type === "whitespace") {
          ret.push(_2nd.matches[0]);
      }
      return ret;
    },
  
    get html () {
        var tmpl = this.template;
        return this._getTokens().map(function(token,i){
        
            var ctx = { title: token.token },
                type = ( token.type === "mention" && token.matches[1] ) ? "list" : token.type;
            
            switch (type) {
                case "list":
                    ctx.name = token.matches[1];
                    /* fallthrough */
                case "mention":
                    ctx.prefix = token.token.charAt(0);
                    ctx.title = ctx["url"] = token.matches[0];
                    break;

                case "hashtag":
                    ctx.prefix = token.token.charAt(0);
                    ctx.title = "#" + token.matches[0];
                    ctx.url = encodeURIComponent(ctx["title"]);
                    ctx.name = token.token;
                    break;

                case "url":
                    ctx.url = token.matches[0];
                    break;

                default:
                    ;
            }
            
            return ( type in tmpl ? tmpl[type] : "%(title)s" )
                .replace(/%\(([^\)]+)\)s/g, function (a,b) { return ctx[b]; });
        
        }).join("");
    },
  
}

twittertext.Message = Message;
