Simple app based on Dasha SDK for Node.js that shows how to handle SIP DTMF codes (pressing buttons on phone during the call).

# Prerequisites:
- node.js 12.0 and above
- dasha cli `npm i -g @dasha.ai/cli`
- logged in an account using `dasha-cli`: `dasha account login default`
- access to the configuration of your PBX or SIP/PSTN/telephony provider

# How to use

- clone this repository
- `npm i`
- `node main.js out -c default -p +XXXX`, where `XXXX` - is your phone number. This will initiate a call to your phone using Dasha sandbox SIP environment (no integration).
- while on a call, enter pin code, then `#`
- if pin code contains `1` - it's correct, and Dasha will say you, that it's correct

## Outbound calls integration with your telephony provider
- Create inbound SIP configuration on your PBX/provider
- Create outbound SIP configuration on Dasha side
    - `dasha sip create-outbound -h`
    - for example: 
```
dasha sip create-outbound --server my-dasha-app.pstn.twilio.com --account +1XXXXXXXXXX --ask-password myTwilio
password: enter_your_password_here
```
- Call to yourself `node main.js out -c myTwilio -p +XXXXXX`
- More info: https://docs.dasha.ai/en-us/default/tutorials/sip-outbound-calls/

## Inbound calls integration with your telephony provider

- Create inbound SIP configuration on Dasha side
`dasha sip create-inbound --application-name dtmf-test-app dtmf-test-app`
- Command will return SIP `uri`, you need to call
- Create outbound SIP configuration on PBX/provider side
- `node main.js in`
- Wait for line: `Waiting for calls via SIP`
- Call to `uri` returned by `dasha sip create-inbound`
- More info: https://docs.dasha.ai/en-us/default/tutorials/sip-inbound-calls/

### Notes:

Happy hacking!!

---
Dasha.AI team

https://dasha.ai















