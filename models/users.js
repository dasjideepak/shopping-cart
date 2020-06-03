var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema({
    name:{ type: String, required: true },
    email:{ type: String, required: true, unique: true, trim: true },
    mobile:{ type: Number, required: true },
    avatar: { type: String },
    password: { type: String, minlength: 4, maxlength: 15 },
    shoppingCart: [{type: Schema.Types.ObjectId, ref: 'Cart'}],
    resetLink: { data: String, default: '' },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

userSchema.pre("save", function(next) {
    var adminEmails = ["dasjideepak@gmail.com"];
    if(adminEmails.includes(this.email))
        this.isAdmin = true;
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