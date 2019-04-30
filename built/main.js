/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from chengengyue
load dependency
"crocoBit": "file:../pxt-crocoBit"
*/
//% color="#C814B8" weight=25 icon="\uf1d4"
var crocoBit_Display;
(function (crocoBit_Display) {
    var enColor;
    (function (enColor) {
        //% blockId="OFF" block="灭"
        enColor[enColor["OFF"] = 0] = "OFF";
        //% blockId="Red" block="红色"
        enColor[enColor["Red"] = 1] = "Red";
        //% blockId="Green" block="绿色"
        enColor[enColor["Green"] = 2] = "Green";
        //% blockId="Blue" block="蓝色"
        enColor[enColor["Blue"] = 3] = "Blue";
        //% blockId="White" block="白色"
        enColor[enColor["White"] = 4] = "White";
        //% blockId="Cyan" block="青色"
        enColor[enColor["Cyan"] = 5] = "Cyan";
        //% blockId="Pinkish" block="品红"
        enColor[enColor["Pinkish"] = 6] = "Pinkish";
        //% blockId="Yellow" block="黄色"
        enColor[enColor["Yellow"] = 7] = "Yellow";
    })(enColor = crocoBit_Display.enColor || (crocoBit_Display.enColor = {}));
    var enLED1;
    (function (enLED1) {
        //% blockId="OFF" block="灭"
        enLED1[enLED1["OFF"] = 0] = "OFF";
        //% blockId="ON" block="亮"
        enLED1[enLED1["ON"] = 1] = "ON";
    })(enLED1 = crocoBit_Display.enLED1 || (crocoBit_Display.enLED1 = {}));
    //% blockId=crocoBit_Display_LED1 block="LED1|pin %pin|value %value"
    //% weight=5
    //% blockGap=8
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=1
    function LED1(pin, value) {
        pins.digitalWritePin(pin, value);
    }
    crocoBit_Display.LED1 = LED1;
    //% blockId=crocoBit_Display_LED2 block="LED2|pin %pin|value %value"
    //% weight=4
    //% blockGap=8
    //% color="#C814B8"
    //% value.min=0 value.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=2
    function LED2(pin, value) {
        pins.analogWritePin(pin, value * 1024 / 256);
    }
    crocoBit_Display.LED2 = LED2;
    //% blockId=crocoBit_Display_BreathLED block="BreathLED|pin %pin"
    //% weight=3
    //% blockGap=8
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=3
    function BreathLED(pin) {
        for (var i = 0; i < 1023; i++) {
            pins.analogWritePin(pin, i);
            //basic.pause(1);
            control.waitMicros(1000);
        }
        basic.pause(10);
        for (var i = 1023; i > 0; i--) {
            pins.analogWritePin(pin, i);
            //basic.pause(1);
            control.waitMicros(1000);
        }
    }
    crocoBit_Display.BreathLED = BreathLED;
    //% blockId=crocoBit_Display_RGB block="RGB|pin1 %pin1|pin2 %pin2|pin3 %pin3|value1 %value1|value2 %value2|value3 %value3"
    //% weight=2
    //% blockGap=8
    //% color="#C814B8"
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function RGB(pin1, pin2, pin3, value1, value2, value3) {
        pins.analogWritePin(pin1, value1 * 1024 / 256);
        pins.analogWritePin(pin2, value2 * 1024 / 256);
        pins.analogWritePin(pin3, value3 * 1024 / 256);
    }
    crocoBit_Display.RGB = RGB;
    //% blockId=crocoBit_Display_RGB2 block="RGB|pin1 %pin1|pin2 %pin2|pin3 %pin3|value %value"
    //% weight=1
    //% blockGap=8
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function RGB2(pin1, pin2, pin3, value) {
        switch (value) {
            case enColor.OFF: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Red: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Green: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Blue: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.White: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Cyan: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Pinkish: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Yellow: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 0);
                break;
            }
        }
    }
    crocoBit_Display.RGB2 = RGB2;
})(crocoBit_Display || (crocoBit_Display = {}));
//% color="#808080" weight=25 icon="\uf11c"
var crocoBit_Input;
(function (crocoBit_Input) {
    var enRocker;
    (function (enRocker) {
        //% blockId="NoState" block="无"
        enRocker[enRocker["NoState"] = 0] = "NoState";
        //% blockId="Up" block="上"
        enRocker[enRocker["Up"] = 1] = "Up";
        //% blockId="Down" block="下"
        enRocker[enRocker["Down"] = 2] = "Down";
        //% blockId="Left" block="左"
        enRocker[enRocker["Left"] = 3] = "Left";
        //% blockId="Right" block="右"
        enRocker[enRocker["Right"] = 4] = "Right";
    })(enRocker = crocoBit_Input.enRocker || (crocoBit_Input.enRocker = {}));
    var enButton;
    (function (enButton) {
        //% blockId="Press" block="按下"
        enButton[enButton["Press"] = 0] = "Press";
        //% blockId="Realse" block="松开"
        enButton[enButton["Realse"] = 1] = "Realse";
    })(enButton = crocoBit_Input.enButton || (crocoBit_Input.enButton = {}));
    //% blockId=crocoBit_Input_Button block="Button|pin %pin|value %value"
    //% weight=90
    //% blockGap=10
    //% color="#808080"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    function Button(pin, value) {
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
    crocoBit_Input.Button = Button;
    //% blockId=crocoBit_Input_Rocker block="Rocker|VRX %pin1|VRY %pin2|value %value"
    //% weight=91
    //% blockGap=10
    //% color="#808080"
    function Rocker(pin1, pin2, value) {
        var x = pins.analogReadPin(pin1);
        var y = pins.analogReadPin(pin2);
        var now_state = enRocker.NoState;
        if (x < 100) // 上
         {
            now_state = enRocker.Up;
        }
        else if (x > 700) //
         {
            now_state = enRocker.Down;
        }
        else // 左右
         {
            if (y < 100) //左
             {
                now_state = enRocker.Left;
            }
            else if (y > 700) //右
             {
                now_state = enRocker.Right;
            }
        }
        return now_state == value;
    }
    crocoBit_Input.Rocker = Rocker;
    //% blockId=crocoBit_Input_Potentiometer block="Potentiometer|pin %pin"
    //% weight=100
    //% blockGap=10
    //% color="#808080"
    //% name.fieldEditor="gridpocker" name.fieldOption.columns=5
    function Potentiometer(pin) {
        var value;
        value = pins.analogReadPin(pin);
        return value;
    }
    crocoBit_Input.Potentiometer = Potentiometer;
})(crocoBit_Input || (crocoBit_Input = {}));
//% color="#228B22" weight=25 icon="\uf0b2"
var crocoBit_Sensor;
(function (crocoBit_Sensor) {
    var enShake;
    (function (enShake) {
        //% blockId="Shake" block="摇动"
        enShake[enShake["Shake"] = 0] = "Shake";
        //% blockId="NoShake" block="静止"
        enShake[enShake["NoShake"] = 1] = "NoShake";
    })(enShake = crocoBit_Sensor.enShake || (crocoBit_Sensor.enShake = {}));
    var enObstacle;
    (function (enObstacle) {
        //% blockId="Obstacle" block="有障碍"
        enObstacle[enObstacle["Obstacle"] = 0] = "Obstacle";
        //% blockId="Empty" block="没障碍"
        enObstacle[enObstacle["Empty"] = 1] = "Empty";
    })(enObstacle = crocoBit_Sensor.enObstacle || (crocoBit_Sensor.enObstacle = {}));
    var enHall;
    (function (enHall) {
        //% blockId="Get" block="有磁铁"
        enHall[enHall["Get"] = 0] = "Get";
        //% blockId="NoGet" block="没磁铁"
        enHall[enHall["NoGet"] = 1] = "NoGet";
    })(enHall = crocoBit_Sensor.enHall || (crocoBit_Sensor.enHall = {}));
    //% blockId=crocoBit_Sensor_Light block="Light|pin %pin"
    //% weight=100
    //% blockGap=10
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    function Light(pin) {
        var value;
        value = pins.analogReadPin(pin);
        return value;
    }
    crocoBit_Sensor.Light = Light;
    //% blockId=crocoBit_Sensor_Sound block="Sound|pin %pin"
    //% weight=100
    //% blockGap=10
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    function Sound(pin) {
        var value;
        value = pins.analogReadPin(pin);
        return value;
    }
    crocoBit_Sensor.Sound = Sound;
    //% blockId=crocoBit_Input_IR block="IR|pin %pin|value %value"
    //% weight=100
    //% blockGap=10
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    function IR(pin, value) {
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
    crocoBit_Sensor.IR = IR;
    //% blockId=crocoBit_Sensor_Shake block="Shake|pin %pin|value %value"
    //% weight=100
    //% blockGap=10
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    function Shake(pin, value) {
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
    crocoBit_Sensor.Shake = Shake;
    //% blockId=crocoBit_Sensor_Hall block="Hall|pin %pin|value %value"
    //% weight=100
    //% blockGap=10
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    function Hall(pin, value) {
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
    crocoBit_Sensor.Hall = Hall;
})(crocoBit_Sensor || (crocoBit_Sensor = {}));
