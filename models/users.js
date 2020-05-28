var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 15,
    },
    resetLink: {
        data: String,
        default: '',
    }
}, {timestamps: true});

userSchema.pre("save", function(next) {
    if(this.password && this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
        console.log(this.password);
    }
    next();
})

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);