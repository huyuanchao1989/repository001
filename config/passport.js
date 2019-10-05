var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { secretOrKey } = require("../config/keys");

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  //通过配置信息来生成jwt的请求，验证这个token
opts.secretOrKey = secretOrKey;

module.exports =
    passport => {
        passport.use(
            new JwtStrategy(opts, (jwt_payload, done) => {
                done(null, jwt_payload);
            })
        );
    }