from json import dumps
from random import randint

import requests
from flask import Flask, Response
from flask.ext.restful import Api, Resource, reqparse
from requests.auth import HTTPBasicAuth

from flask_restful.utils import cors

app = Flask(__name__)
api = Api(app)
api.decorators = [
    cors.crossdomain(origin='*', headers=['accept', 'Content-Type'])
]

key = '<Plivo_AUTHID>'
token = '<Plivo_AuthToken>'
numberList = []


def send_message(to_number, otp):
    print("Preparing to send message")
    otp_text = 'Your code for login is ' + str(otp)
    msg_data = {'src': 'PLVSMS', 'dst': to_number, 'text': otp_text}
    headers = {'Content-Type': 'application/json'}
    print("Message destination:" + to_number)
    print("Message text:" + otp_text)
    r = requests.post(
        'https://api.plivo.com/v1/Account/AuthID/Message/',
        data=dumps(msg_data),
        auth=HTTPBasicAuth(key, token),
        headers=headers)
    if r.status_code == 202:
        print("Message sending success")
        return True
    else:
        print("Message failed" + str(r.status_code))
        return False


def make_call(to_number, otp):
    print("Preparing for Voice")
    xml_url = 'https://8ed6584d.ngrok.io/return_xml/?otp=' + str(otp)
    print("Answer URL is " + xml_url)
    voice_data = {
        'to': to_number,
        'from': '91xxxxxxxxxx',
        'answer_url': xml_url,
        'answer_method': 'GET'
    }
    headers = {'Content-Type': 'application/json'}
    r = requests.post(
        'https://api.plivo.com/v1/Account/AuthID/Call/',
        data=dumps(voice_data),
        auth=HTTPBasicAuth(key, token),
        headers=headers)
    if r.status_code == 201:
        return True
    else:
        print("Voice error" + str(r.status_code))
        return False


def make_digits(otp):
    retval = ''
    for c in otp:
        retval = retval + c + ','
    return retval


class AddNumber(Resource):
    def post(self):
        print("Before Request Parser")
        present = 0
        parser = reqparse.RequestParser()
        parser.add_argument('number', type=str, required=True, location='json')
        parser.add_argument('type', type=str, default='sms', location='json')
        args = parser.parse_args(strict=False)
        for n in numberList:
            if (n['number'] == args['number']):
                present = 1
                number_to_send = n['number']
                otp_to_send = n['otp']
                break
        if (present == 0):
            print("Number is " + str(args['number']))
            otp = randint(100000, 999999)
            new_number = {
                'number': args['number'],
                'otp': otp,
                'verified': 'false'
            }
            numberList.append(new_number)
            number_to_send = new_number['number']
            otp_to_send = new_number['otp']
            print(new_number)
        if (args['type'] == 'sms'):
            print("OTP Type: SMS")
            status = send_message(number_to_send, otp_to_send)
        elif (args['type'] == 'voice'):
            print("OTP Type: Voice")
            status = make_call(number_to_send, otp_to_send)
        if (status):
            return {'number': args['number'], 'verified': 'false'}
        else:
            return {'error': 'number addition failed'}

    def options(self):
        resp = Response('Options')
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Methods'] = 'POST'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp


class VerifyNumber(Resource):
    def post(self, number):
        parser = reqparse.RequestParser()
        parser.add_argument('otp', type=str, required=True)
        args = parser.parse_args(strict='True')
        for n in numberList:
            if (n['number'] == number):
                if (n['verified'] == 'false' and str(n['otp']) == args['otp']):
                    return {'number': number, 'verified': 'true'}
                else:
                    return {'message': 'Verification failed'}
        return {'message': 'Please register before verifying'}

    def options(self, number):
        resp = Response('Options')
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Methods'] = 'POST'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp


class ReturnXML(Resource):
    def get(self):
        print("Fetching XML")
        parser = reqparse.RequestParser()
        parser.add_argument('otp', type=str, required=True)
        args = parser.parse_args(strict=False)
        otp = args.get('otp')
        otp_digits = make_digits(otp)
        resp = '<Response><Speak>Your code is {otp}</Speak></Response>'.format(
            otp=otp_digits)
        return Response(resp, mimetype='text/xml')


api.add_resource(AddNumber, '/numbers/', endpoint='numbers')
api.add_resource(VerifyNumber, '/numbers/<string:number>', endpoint='number')
api.add_resource(ReturnXML, '/return_xml/', endpoint='xml')

if __name__ == '__main__':
    app.run(debug=True)
