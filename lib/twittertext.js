var twittertext = exports;


var syntax = {
    twitter: {
        mention: /(?=(^|[^a-zA-Z0-9_]))[@＠]([a-zA-Z0-9_]{1,20})(?=([^@＠]|$))/,
        url: /http:\/\/[^ ]*/i,
        hashtag: /#[a-z]+/i,
    }
};


/*
 * Tiny tokenizer
 *
 * - Accepts a subject string and an object of regular expressions for parsing
 * - Returns an array of token objects
 *
 * tokenize('this is text.', { word:/\w+/, whitespace:/\s+/, punctuation:/[^\w\s]/ }, 'invalid');
 * result => [{ token="this", type="word" },{ token=" ", type="whitespace" }, Object { token="is", type="word" }, ... ]
 *
 */
function tokenize ( s, parsers, deftok ) {
  var m, r, l, t, tokens = [];
  while ( s ) {
    t = null;
    m = s.length;
    for ( var key in parsers ) {
      r = parsers[ key ].exec( s );
      // try to choose the best match if there are several
      // where "best" is the closest to the current starting point
      if ( r && ( r.index < m ) ) {
        t = {
          token: r[ 0 ],
          type: key,
          matches: r.slice( 1 )
        }
        m = r.index;
      }
    }
    if ( m ) {
      // there is text between last token and currently 
      // matched token - push that out as default or "unknown"
      tokens.push({
        token : s.substr( 0, m ),
        type  : deftok || 'unknown'
      });
    }
    if ( t ) {
      // push current token onto sequence
      tokens.push( t ); 
    }
    s = s.substr( m + (t ? t.token.length : 0) );
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
