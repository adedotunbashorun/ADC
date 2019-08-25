const ActivityLog = require('../Modules/Core/models/ActivityLog')
const User = require('../Modules/User/models/User')
const File = require('./file')
const request = require('request')
var nodemailer = require("nodemailer")
var sgTransport = require("nodemailer-sendgrid-transport")
var NodeGeocoder = require('node-geocoder')
const config = require('../adc.json')


var options = {
    auth: {
        api_user: process.env.SENDGRID_USERNAME,
        api_key: process.env.SENDGRID_PASSWORD
    },    
}

 var africastalking  = {
    apiKey: 'f39adb22724c3c6686c19dce339dcb3e5344bb412512b294193c27139f5a0b93', //         // use your sandbox app API key for development in the test environment
    username: 'weserve',      // use 'sandbox' for development in the test environment
}

let client = nodemailer.createTransport(sgTransport(options))

var fs = require('fs')
const Activity = {}
var result = {}
var trans
var data = {}


Activity.getDecode= function(user = '',address){
    var options = {
        provider: 'google',
       
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyDECOtEW9X3ctXS7lg3Xh_4rCrV2ervJf0', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    }
       
    var geocoder = NodeGeocoder(options)
    geocoder.geocode(address).then(function(res) {
        // console.log(res[0].latitude);
        if(user != '')
            user.country = res[0].country
            user.city = res[0].city
            user.latitude = res[0].latitude
            user.longitude = res[0].longitude
            user.save()
            return res[0]
    }).catch(function(err) {
        // console.log(err);
        return ''
    })    
    
}



Activity.makeid = function(length) {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < length; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }console.log(text)
    return text
}

Activity.Sms = (to, message) => {
    
    const AfricasTalking = require('africastalking')(africastalking);

    sms = AfricasTalking.SMS

    // Use the service
    const options = {
        to: to,
        message: message,
        // from: 'ServeMe'
    }

    // Send message and capture the response or error
    sms.send(options).then( response => {   
        console.log(response); 
    })
    .catch( error => {
            console.log(error);
    });
}


Activity.Base64_encode = function(file) {
    // read binary data
    var bitmap = fs.readFileSync(file)
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64')
}


Activity.Email = function(data, subject, message) {
    try {
        var email = {
            from: config.app_name,
            to: (data.email) ? data.email : config.email,
            subject: subject,
            html: message
        }

        client.sendMail(email, function(err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("Message sent: " + info.response)
            }
        })
    } catch (error) {
        return res.status(401).json({ "success": false, "message": error })
    }
}


Activity.html = function (data){
    return  '<div id="content" style="background-color: #1D4BB7width:100%">'+
                '<nav>'+
                    '<div class="container-fluid">'+
                            '<span><a href="https://refill-app.herokuapp.com"><img src="https://refillappapi.herokuapp.com/uploads/images/refill_logo.png" style="width: 120px height: 45px padding:10px" class="img-responsive"></a></span>'+
                    '</div>'+
                '</nav>'+
                '<div style="background-color: #fefefepadding:20pxcolor:#000">'+ data + '</div>'+
            '</div>'
}

Activity.Subscribers = (message)=>{
    EmailAlert.find({ status: 1 }, null, { sort: { 'created_at': -1 } }, function (error, emails) {
        if (error) return res.json(error)
        for (user of emails) {
            try {
                var email = {
                    from: config.app_name,
                    to: user.email,
                    subject: message.title,
                    html: this.html(message.message)
                }

                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Message sent: " + info.response)
                    }
                })
            } catch (error) {
                return res.status(401).json({ "success": false, "message": error })
            }
        }
    })
}

Activity.activity_log = (req, user_id, description) => {
    if (user_id) {
        let logs = new ActivityLog()
        logs.user_id = user_id
        logs.description = description
        logs.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress
        return logs.save()
    }
}

Activity.alertEmail = async (req) => {
    if (req) {
        let alert = new EmailAlert()
        alert.email = req.body.email
        alert.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress
        return await alert.save()
    }
}

Activity.Transaction = async (order) => {
    var options = {
        method: 'POST',
        json: true,
        url: 'https://api.paystack.co/transaction/verify/' + order.reference,
        headers: {
            'Authorization': 'Bearer ' + config.paystack_test_secret_key
        }
    }
    let trans = await request.get(options, (err, body) => {
        if (err) return err
        data.transaction = body.body
        trans = new Payment()
        trans.reference = order.reference
        trans.order_id = order._id
        trans.type = (order.payment_option === 1) ? "Online" : "Cash On Delivery"
        trans.status = body.body.data.status
        trans.message = body.body.message
        trans.fees = body.body.data.fees / 100
        trans.fees_split = body.body.data.fees_split / 100
        trans.amount = body.body.data.amount / 100
        return trans.save()
    })

    return result.transaction = trans
}

Activity.getRandomItem = async (items) =>{  
    let item = await items[Math.floor(Math.random()*items.length)];     
    return item;
}



module.exports = Activity