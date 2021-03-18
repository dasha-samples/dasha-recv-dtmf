context {
    input phone: string;
    output pincode: string = "";
}

external function checkPin(pin:string): boolean;
start node root
{
    do
    {
        #connectSafe($phone);
        #waitForSpeech(1000);
        #say("hello");
        goto waitPin;
    }
    transitions
    {
        waitPin: goto waitPin;
    }
}

node waitPin
{
    do
    {
        #log("pincode is: " + $pincode);
        wait *;
    } transitions
    {
        waitPin: goto waitPin on true tags: onprotocol;
        checkPin: goto checkPin on #getDTMF()=="#" priority 1 tags: onprotocol;
        voiceEvent: goto waitPin on true;
    } onexit
    {
        waitPin: do {
            var code = #getDTMF();
            #log(code);
            if (code is not null)
            {
                set $pincode = $pincode + code;
            }
        }
    }
}

node checkPin
{
    do
    {
        if (external checkPin($pincode))
        {
            #say("correct");
        } else
        {
            #say("incorrect");
        }

        exit;
    }
}

digression close
{
    conditions { on true tags: onclosed; }
    do
    {
        exit;
    }
}
