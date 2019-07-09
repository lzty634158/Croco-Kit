/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from chengengyue
*/


//% color="#228B22" weight=25 icon="\uf0b2"
namespace CrocoKit_Sensor {

    const COLOR_ADD = 0X53;
    const COLOR_REG = 0x00;
    const COLOR_R = 0X10;
    const COLOR_G = 0X0D;
    const COLOR_B = 0x13;

    let initialized = false;
    let val_red = 0;
    let val_green = 0;
    let val_blue = 0;

    export enum enGetRGB {
        //% blockId="GetValueR" block="GetValueR"
        GetValueR = 0,
        //% blockId="GetValueG" block="GetValueG"
        GetValueG = 1,
        //% blockId="GetValueB" block="GetValueB"
        GetValueB = 2
    }

    export enum enObstacle {
        //% blockId="Obstacle" block="Obstacle"
        Obstacle = 0,
        //% blockId="NoObstacle" block="NoObstacle"
        NoObstacle = 1
    }

    function i2cWriteData(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function setRegConfig(): void {
        i2cWriteData(COLOR_ADD, COLOR_REG, 0X06);
        i2cWriteData(COLOR_ADD, 0X04, 0X41);
        i2cWriteData(COLOR_ADD, 0x05, 0x01);
    }

    function initColorI2C(): void {
        setRegConfig();
        initialized = true;
    }

    function GetRGB(): void {
        let buff_R = pins.createBuffer(2);
        let buff_G = pins.createBuffer(2);
        let buff_B = pins.createBuffer(2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_R, NumberFormat.UInt8BE);
        buff_R = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_G, NumberFormat.UInt8BE);
        buff_G = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_B, NumberFormat.UInt8BE);
        buff_B = pins.i2cReadBuffer(COLOR_ADD, 2);

        let Red = (buff_R[1] & 0xff) << 8 | (buff_R[0] & 0xff);
        let Green = (buff_G[1] & 0xff) << 8 | (buff_G[0] & 0xff);
        let Blue = (buff_B[1] & 0xff) << 8 | (buff_B[0] & 0xff);

        if (Red > 4500) Red = 2300;
        if (Green > 7600) Green = 4600;
        if (Blue > 4600) Blue = 2700;

        val_red = Math.map(Red, 0, 2300, 0, 255);
        val_green = Math.map(Green, 0, 4600, 0, 255);
        val_blue = Math.map(Blue, 0, 2700, 0, 255);

        if (val_red > 255) val_red = 255;
        if (val_green > 255) val_green = 255;
        if (val_blue > 255) val_blue = 255;

        if (val_red == val_green && val_red == val_blue) {
            val_red = 255;
            val_green = 255;
            val_blue == 255;
        }
        else if (val_red > val_green && val_red > val_blue) {
            val_red = 255;
            val_green /= 2;
            val_blue /= 2;
        }
        else if (val_green > val_red && val_green > val_blue) {
            val_green = 255;
            val_red /= 2;
            val_blue /= 2;
        }
        else if (val_blue > val_red && val_blue > val_green) {
            val_blue = 255;
            val_red /= 2;
            val_green /= 2;
        }
    }


    //% blockId=CrocoKit_Sensor_Light block="Light|pin %pin"
    //% weight=100
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5 
    export function Light(pin: AnalogPin): number {
        let value: number;
        value = pins.analogReadPin(pin);
        return value;
    }

    //% blockId=CrocoKit_Sensor_Sound block="Sound|pin %pin"
    //% weight=99
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Sound(pin: AnalogPin): number {
        let value: number;
        value = pins.analogReadPin(pin);
        return value;
    }

    //% blockId=CrocoKit_Sensor_GetRGBValue block="GetRGBValue|value %value"
    //% blockGap=20
    //% weight=98
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function GetRGBValue(value: enGetRGB): number {
        if (!initialized) {
            initColorI2C();
        }
        GetRGB();
        switch (value) {
            case enGetRGB.GetValueR:
                return val_red;
            case enGetRGB.GetValueG:
                return val_green;
            case enGetRGB.GetValueB:
                return val_blue;
            default:
                break;
        }
        return 0;
    }

    //% blockId=CrocoKit_Sensor_Ultrasonic block="Ultrasonic|Trig %Trig|Echo %Echo"
    //% color="#228B22"
    //% weight=97
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Ultrasonic(Trig: DigitalPin, Echo: DigitalPin): number {
        //send pulse
        pins.setPull(Trig, PinPullMode.PullNone);
        pins.digitalWritePin(Trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(Trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(Trig, 0);

        //read pulse, maximum distance=500cm
        const d = pins.pulseIn(Echo, PulseValue.High, 500 * 58);   

        return Math.idiv(d, 58);
    }


    //% blockId=CrocoKit_Sensor_IR block="IR|pin %pin|value %value"
    //% weight=96
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function IR(pin: DigitalPin, value: enObstacle): boolean {
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }

    //% blockId=CrocoKit_Sensor_Vibration block="Vibration|pin %pin|get "
    //% weight=95
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Vibration(pin: DigitalPin, handle: () => void): void {
        pins.setPull(pin, PinPullMode.PullUp);
        pins.setEvents(pin, PinEventType.Pulse);
        pins.onPulsed(pin, PulseValue.High, handle);
    }

    //% blockId=CrocoKit_Sensor_Hall block="Hall|pin %pin|get "
    //% weight=94
    //% blockGap=20
    //% color="#228B22"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Hall(pin: DigitalPin, handle: () => void): void {
        pins.setPull(pin, PinPullMode.PullUp);
        pins.setEvents(pin, PinEventType.Pulse);
        pins.onPulsed(pin, PulseValue.High, handle);

    }
}

//% color="#C814B8" weight=24 icon="\uf1d4"
namespace CrocoKit_Display {

    export enum enColor {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="Red" block="Red"
        Red,
        //% blockId="Green" block="Green"
        Green,
        //% blockId="Blue" block="Blue"
        Blue,
        //% blockId="White" block="White"
        White,
        //% blockId="Cyan" block="Cyan"
        Cyan,
        //% blockId="Pinkish" block="Pinkish"
        Pinkish,
        //% blockId="Yellow" block="Yellow"
        Yellow,
    }

    export enum enLED1 {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="ON" block="ON"
        ON = 1
    }

    //% blockId=CrocoKit_Display_LED1 block="LED1|pin %pin|value %value"
    //% weight=5
    //% blockGap=20
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=1
    export function LED1(pin: DigitalPin, value: enLED1): void {
        pins.digitalWritePin(pin, value);
    }

    //% blockId=CrocoKit_Display_LED2 block="LED2|pin %pin|value %value"
    //% weight=4
    //% blockGap=20
    //% color="#C814B8"
    //% value.min=0 value.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=2
    export function LED2(pin: AnalogPin, value: number): void {
        pins.analogWritePin(pin, value * 1024 / 256);
    }

    //% blockId=CrocoKit_Display_BreathLED block="BreathLED|pin %pin"
    //% weight=3
    //% blockGap=20
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=3
    export function BreathLED(pin: AnalogPin): void {
        for (let i: number = 0; i < 1023; i++) {
            pins.analogWritePin(pin, i);
            //basic.pause(1);
            control.waitMicros(1000);
        }
        basic.pause(10);
        for (let i: number = 1023; i > 0; i--) {
            pins.analogWritePin(pin, i);
            //basic.pause(1);
            control.waitMicros(1000);
        }
    }

    //% blockId=CrocoKit_Display_RGB block="RGB|pin1 %pin1|pin2 %pin2|pin3 %pin3|value1 %value1|value2 %value2|value3 %value3"
    //% weight=2
    //% blockGap=20
    //% color="#C814B8"
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB(pin1: AnalogPin, pin2: AnalogPin, pin3: AnalogPin, value1: number, value2: number, value3: number): void {
        pins.analogWritePin(pin1, value1 * 1024 / 256);
        pins.analogWritePin(pin2, value2 * 1024 / 256);
        pins.analogWritePin(pin3, value3 * 1024 / 256);
    }

    //% blockId=CrocoKit_Display_RGB2 block="RGB|pin1 %pin1|pin2 %pin2|pin3 %pin3|value %value"
    //% weight=1
    //% blockGap=20
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB2(pin1: DigitalPin, pin2: DigitalPin, pin3: DigitalPin, value: enColor): void {

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
}

//% color="#808080" weight=23 icon="\uf11c"
namespace CrocoKit_Input {
    export enum enRocker {
        //% blockId="NoState" block="NoState"
        NoState = 0,
        //% blockId="Up" block="Up"
        Up,
        //% blockId="Down" block="Down"
        Down,
        //% blockId="Left" block="Left"
        Left,
        //% blockId="Right" block="Right"
        Right,
    }

    export enum enButton {
        //% blockId="Press" block="Press"
        Press = 0,
        //% blockId="Realse" block="Realse"
        Realse = 1
    }

    //% blockId=CrocoKit_Input_Potentiometer block="Potentiometer|pin %pin"
    //% weight=100
    //% blockGap=20
    //% color="#808080"
    //% name.fieldEditor="gridpocker" name.fieldOption.columns=5
    export function Potentiometer(pin: AnalogPin): number {
        let value: number;
        value = pins.analogReadPin(pin);
        return value;
    }

    //% blockId=CrocoKit_Input_Rocker block="Rocker|pin1 %pin1|pin2 %pin2|value %value"
    //% weight=99
    //% blockGap=20
    //% color="#808080"
    export function Rocker(pin1: AnalogPin, pin2: AnalogPin, value: enRocker): boolean {
        let x = pins.analogReadPin(pin1);
        let y = pins.analogReadPin(pin2);
        let now_state = enRocker.NoState;

        if (x < 100) // 左
        {
            now_state = enRocker.Left;
        }
        else if (x > 700) //右
        {
            now_state = enRocker.Right;
        }
        else  // 上下
        {
            if (y < 100) //下
            {
                now_state = enRocker.Down;
            }
            else if (y > 700) //上
            {
                now_state = enRocker.Up;
            }
        }
        return now_state == value;
    }

    //% blockId=CrocoKit_Input_Button block="Button|pin %pin|value %value"
    //% weight=98
    //% blockGap=20
    //% color="#808080"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Button(pin: DigitalPin, value: enButton): boolean {
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }

}

//% color="#ECA40D" weight=22 icon="\uf085"
namespace CrocoKit_Motor {

    //% blockId=CrocoKit_Motor_Servo block="Servo|pin %pin|value %value"
    //% weight=100
    //% blockGap=20
    //% value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Servo(pin: AnalogPin, value: number): void {
        pins.servoWritePin(pin, value);
    }

    //% blockId=CrocoKit_Motor_MotorRun block="Motor|%pin|speed %speed"
    //% weight=99
    //% blockGap=20
    //% speed.min=0 speed.max=1023
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function MotorRun(pin: AnalogPin, speed: number): void {
        pins.analogWritePin(pin, speed);
    }

    //% blockId=CrocoKit_Motor_MotorStop block="MotorStop |pin %pin"
    //% weight=98
    //% blockGap=20
    export function MotorStop(pin: AnalogPin): void {
        pins.analogWritePin(pin, 0);
    }
}

//% color="#8FBC8F" weight=21 icon="\uf001"
namespace CrocoKit {

    let key_state = 0;
    let old_key = 0;
    let button_state = 0;
    let old_button = 0;
    let key_state_1 = 0;
    let old_key_1 = 0;

    export enum enMusic {
        dadadum = 0,
        entertainer,
        prelude,
        ode,
        nyan,
        ringtone,
        funk,
        blues,
        birthday,
        wedding,
        funereal,
        punchline,
        baddy,
        chase,
        ba_ding,
        wawawawaa,
        jump_up,
        jump_down,
        power_up,
        power_down
    }

    export enum touch_pin {
        None = 0,
        P2 = 2,
        P5 = 5,
        P8 = 8,
        P11 = 11,
        P12 = 12,
        P13 = 13,
        P14 = 14,
        P15 = 15
    }

    export enum touch {
        //% blockId="None" block="None"
        None = 0x0000,
        //% blockId="C" block="C"
        C = 0x0001,
        //% blockId="D" block="D"
        D = 0x0002,
        //% blockId="E" block="E"
        E = 0x0004,
        //% blockId="F" block="F"
        F = 0x0008,
        //% blockId="G" block="G"
        G = 0x0010,
        //% blockId="A" block="A"
        A = 0x0020,
        //% blockId="B" block="B"
        B = 0x0040,
        //% blockId="CH" block="CH"
        CH = 0x0080,
    }

    export enum enKeys {
        A = 65,
        B,
        C,
        D,
        E,
        F,
        G,
        H,
        I,
        J,
        K,
        L,
        M,
        N,
        O,
        P,
        Q,
        R,
        S,
        T,
        U,
        V,
        W,
        X,
        Y,
        Z
    }

    export enum enKeyBoard {
        //% blockId="VK_LEFT" block="VK_LEFT"
        VK_LEFT = 37,
        //% blockId="VK_UP" block="VK_UP"
        VK_UP = 38,
        //% blockId="VK_RIGHT" block="VK_RIGHT"
        VK_RIGHT = 39,
        //% blockId="VK_DOWN" block="VK_DOWN"
        VK_DOWN = 40,
        //% blockId="VK_SPACE" block="VK_SPACE"
        VK_SPACE = 32,
        //% blockId="VK_DELETE" block="VK_DELETE"
        VK_DELETE = 46,
        //% blockId="VK_W" block="VK_W"
        VK_W = 87,
        //% blockId="VK_S" block="VK_S"
        VK_S = 83,
        //% blockId="VK_A" block="VK_A"
        VK_A = 65,
        //% blockId="VK_D" block="VK_D"
        VK_D = 68,
        //% blockId="VK_J" block="VK_J"
        VK_J = 74,
        //% blockId="VK_K" block="VK_K"
        VK_K = 75,

        //% blockId="VK_LEFT_Release" block="VK_LEFT_Release"
        VK_LEFT_Release = 7,
        //% blockId="VK_UP_Release" block="VK_UP_Release"
        VK_UP_Release = 8,
        //% blockId="VK_RIGHT_Release" block="VK_RIGHT_Release"
        VK_RIGHT_Release = 9,
        //% blockId="VK_DOWN_Release" block="VK_DOWN_Release"
        VK_DOWN_Release = 10,
        //% blockId="VK_W_Release" block="VK_W_Release"
        VK_W_Release = 11,
        //% blockId="VK_S_Release" block="VK_S_Release"
        VK_S_Release = 12,
        //% blockId="VK_A_Release" block="VK_A_Release"
        VK_A_Release = 13,
        //% blockId="VK_D_Release" block="VK_D_Release"
        VK_D_Release = 14,
        //% blockId="VK_J_Release" block="VK_J_Release"
        VK_J_Release = 15,
        //% blockId="VK_K_Release" block="VK_K_Release"
        VK_K_Release = 16,
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    //% blockId=CrocoKit_Play_Music block="Music_Handle|%index"
    //% weight=99
    //% blockGap=20
    //% color="#8FBC8F"
    //% index.min=0 index.max=19
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Play_Music(index: number): void {
        switch (index) {
            case enMusic.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case enMusic.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case enMusic.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case enMusic.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case enMusic.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case enMusic.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case enMusic.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case enMusic.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case enMusic.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case enMusic.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case enMusic.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case enMusic.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case enMusic.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case enMusic.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case enMusic.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case enMusic.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case enMusic.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case enMusic.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case enMusic.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case enMusic.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }

    //% blockId=CrocoKit_Music_Handle block="Music_Handle|%index"
    //% weight=98
    //% blockGap=20
    //% color="#8FBC8F"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music_Handle(index: enMusic): void {
        switch (index) {
            case enMusic.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case enMusic.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case enMusic.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case enMusic.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case enMusic.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case enMusic.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case enMusic.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case enMusic.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case enMusic.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case enMusic.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case enMusic.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case enMusic.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case enMusic.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case enMusic.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case enMusic.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case enMusic.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case enMusic.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case enMusic.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case enMusic.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case enMusic.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }

    //% blockId=CrocoKit_Touch block="Music Touch return"
    //% weight=97
    //% blockGap=20
    //% color="#8FBC8F"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Touch(): number {
        let a = 0;
        let b = 0;
        let c = 0;
        pins.i2cWriteNumber(0x50, 8, NumberFormat.UInt8BE, false);
        a = pins.i2cReadNumber(0x50, NumberFormat.UInt8BE, true);
        b = pins.i2cReadNumber(0x50, NumberFormat.UInt8BE, false);
        c = (b << 8) | a;
        return c;
    }

    //% blockId=CrocoKit_TouchButton block="Music Button|%value"
    //% weight=96
    //% blockGap=20
    //% color="#8FBC8F"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function TouchButton(value: touch): number {

        let c = value;
        return c;
    }

    //% blockId=CrocoKit_PlayPiano block="Play Piano|tone %value"
    //% weight=95
    //% blockGap=20
    //% color="#8FBC8F"
    //% value.min=1 value.max=3 value.defl=2
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function PlayPiano(value: number): void {
        let a = 0;
        let b = 0;
        let c = 0;
        let temp = 0;
        pins.i2cWriteNumber(0x50, 8, NumberFormat.UInt8BE, false);
        a = pins.i2cReadNumber(0x50, NumberFormat.UInt8BE, true);
        b = pins.i2cReadNumber(0x50, NumberFormat.UInt8BE, false);
        c = (b << 8) | a;

        if (value == 1) {
            if ((c & temp) != 0) {
                c = c & temp;
            } else if (c & touch.C) {
                music.ringTone(131);
            } else if (c & touch.D) {
                music.ringTone(147);
            } else if (c & touch.E) {
                music.ringTone(165);
            } else if (c & touch.F) {
                music.ringTone(175);
            } else if (c & touch.G) {
                music.ringTone(196);
            } else if (c & touch.A) {
                music.ringTone(220);
            } else if (c & touch.B) {
                music.ringTone(247);
            } else if (c & touch.CH) {
                music.ringTone(262);
            } else if (c == touch.None) {
                //music.ringTone(0);
                pins.digitalWritePin(DigitalPin.P0, 0);
            }
        }
        else if (value == 2) {
            if ((c & temp) != 0) {
                c = c & temp;
            } else if (c & touch.C) {
                music.ringTone(262);
            } else if (c & touch.D) {
                music.ringTone(294);
            } else if (c & touch.E) {
                music.ringTone(330);
            } else if (c & touch.F) {
                music.ringTone(349);
            } else if (c & touch.G) {
                music.ringTone(392);
            } else if (c & touch.A) {
                music.ringTone(440);
            } else if (c & touch.B) {
                music.ringTone(494);
            } else if (c & touch.CH) {
                music.ringTone(523);
            } else if (c == touch.None) {
                //music.ringTone(0);
                pins.digitalWritePin(DigitalPin.P0, 0);
            }
        }
        else if (value == 3) {
            if ((c & temp) != 0) {
                c = c & temp;
            } else if (c & touch.C) {
                music.ringTone(523);
            } else if (c & touch.D) {
                music.ringTone(587);
            } else if (c & touch.E) {
                music.ringTone(659);
            } else if (c & touch.F) {
                music.ringTone(698);
            } else if (c & touch.G) {
                music.ringTone(784);
            } else if (c & touch.A) {
                music.ringTone(880);
            } else if (c & touch.B) {
                music.ringTone(988);
            } else if (c & touch.CH) {
                music.ringTone(1046);
            } else if (c == touch.None) {
                //music.ringTone(0);
                pins.digitalWritePin(DigitalPin.P0, 0);
            }
        }
    }

    //% blockId=CrocoKit_KeyBoard_Touch block="KeyBoard Touch Return|value %value"
    //% weight=94
    //% blockGap=20 
    //% color="#8FBC8F"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function KeyBoard_Touch(value: touch_pin): boolean {
        let a = 0;
        let b = 0;
        let c = 0;
        let temp = 0;
        pins.i2cWriteNumber(0x50, 8, NumberFormat.UInt8BE, false);
        a = pins.i2cReadNumber(0x50, NumberFormat.UInt8BE, true);
        b = pins.i2cReadNumber(0x50, NumberFormat.UInt8BE, false);
        c = (b << 8) | a;
        if ((c & temp) != 0) {
            c = c & temp;
        } else {
            switch (value) {
                case touch_pin.None:
                    return (c & touch.None) == 0;
                    break;
                case touch_pin.P2:
                    return (c & touch.C) == 0x0001;
                    break;
                case touch_pin.P5:
                    return (c & touch.D) == 0x0002;
                    break;
                case touch_pin.P8:
                    return (c & touch.E) == 0x0004;
                    break;
                case touch_pin.P11:
                    return (c & touch.F) == 0x0008;
                    break;
                case touch_pin.P12:
                    return (c & touch.G) == 0x0010;
                    break;
                case touch_pin.P13:
                    return (c & touch.A) == 0x0020;
                    break;
                case touch_pin.P14:
                    return (c & touch.B) == 0x0040;
                    break;
                case touch_pin.P15:
                    return (c & touch.CH) == 0x0080;
                    break;
                default:
                    break;
            }
        }
        return false;
    }


    //% blockId=CrocoKit_KeyBoard_SetBaudRate block="KeyBoard SetBaudRate|%baudRate"
    //% weight=93
    //% blockGap=20 
    //% color="#8FBC8F"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function KeyBoard_SetBaudRate(baudRate: BaudRate): void {
        serial.redirect(SerialPin.USB_TX, SerialPin.USB_RX, baudRate);
    }

    //% blockId=CrocoKit_KeyBoard block="KeyBoard|%key"
    //% weight=92
    //% blockGap=20 
    //% color="#8FBC8F"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function KeyBoard(key: enKeyBoard): void {
        switch (key) {
            case enKeyBoard.VK_UP:
                key_state_1 = 1;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$&1#");
                    old_key_1 = 1;
                }
                break;
            case enKeyBoard.VK_UP_Release:
                key_state_1 = 0;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$&0#");
                    old_key_1 = 0;
                }
                break;

            case enKeyBoard.VK_DOWN:
                key_state_1 = 1;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$(1#");
                    old_key_1 = 1;
                }
                break;
            case enKeyBoard.VK_DOWN_Release:
                key_state_1 = 0;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$(0#");
                    old_key_1 = 0;
                }
                break;

            case enKeyBoard.VK_LEFT:
                key_state = 1;
                if (key_state != old_key) {
                    serial.writeString("$%1#");
                    old_key = 1;
                }
                break;
            case enKeyBoard.VK_LEFT_Release:
                key_state = 0;
                if (key_state != old_key) {
                    serial.writeString("$%0#");
                    old_key = 0;
                }
                break;

            case enKeyBoard.VK_RIGHT:
                key_state = 1;
                if (key_state != old_key) {
                    serial.writeString("$'1#");
                    old_key = 1;
                }
                break;
            case enKeyBoard.VK_RIGHT_Release:
                key_state = 0;
                if (key_state != old_key) {
                    serial.writeString("$'0#");
                    old_key = 0;
                }
                break;

            case enKeyBoard.VK_SPACE:
                serial.writeString("$ 1#");
                basic.pause(50);
                serial.writeString("$ 0#");
                break;

            case enKeyBoard.VK_DELETE:
                serial.writeString("$.1#");
                basic.pause(50);
                serial.writeString("$.0#");
                break;

            case enKeyBoard.VK_W:
                key_state_1 = 1;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$W1#");
                    old_key_1 = 1;
                }
                break;
            case enKeyBoard.VK_W_Release:
                key_state_1 = 0;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$W0#");
                    old_key_1 = 0;
                }
                break;

            case enKeyBoard.VK_S:
                key_state_1 = 1;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$S1#");
                    old_key_1 = 1;
                }
                break;
            case enKeyBoard.VK_S_Release:
                key_state_1 = 0;
                if (key_state_1 != old_key_1) {
                    serial.writeString("$S0#");
                    old_key_1 = 0;
                }
                break;

            case enKeyBoard.VK_A:
                key_state = 1;
                if (key_state != old_key) {
                    serial.writeString("$A1#");
                    old_key = 1;
                }
                break;
            case enKeyBoard.VK_A_Release:
                key_state = 0;
                if (key_state != old_key) {
                    serial.writeString("$A0#");
                    old_key = 0;
                }
                break;

            case enKeyBoard.VK_D:
                key_state = 1;
                if (key_state != old_key) {
                    serial.writeString("$D1#");
                    old_key = 1;
                }
                break;
            case enKeyBoard.VK_D_Release:
                key_state = 0;
                if (key_state != old_key) {
                    serial.writeString("$D0#");
                    old_key = 0;
                }
                break;

            case enKeyBoard.VK_J:
                button_state = 1;
                if (button_state != old_button) {
                    serial.writeString("$J1#");
                    old_button = 1;
                }
                break;
            case enKeyBoard.VK_J_Release:
                button_state = 0;
                if (button_state != old_button) {
                    serial.writeString("$J0#");
                    old_button = 0;
                }
                break;

            case enKeyBoard.VK_K:
                button_state = 1;
                if (button_state != old_button) {
                    serial.writeString("$K1#");
                    old_button = 1;
                }
                break;
            case enKeyBoard.VK_K_Release:
                button_state = 0;
                if (button_state != old_button) {
                    serial.writeString("$K0#");
                    old_button = 0;
                }
                break;

            default:
                break;
        }
    }

    //% blockId=CrocoKit_KeyBoard_Number block="KeyBoard sendNumber|%value"
    //% weight=91
    //% blockGap=20 
    //% color="#8FBC8F"
    //% value.min=0 value.max=9
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function KeyBoard_Number(value: number): void {
        if (value >= 0 && value <= 9) {
            serial.writeString("$" + value + "1#");
            basic.pause(50);
            serial.writeString("$" + value + "0#");
        }
    }

    //% blockId=CrocoKit_KeyBoard_Keys block="KeyBoard sendKeys|%key"
    //% weight=90
    //% blockGap=20 
    //% color="#8FBC8F"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function KeyBoard_Keys(key: enKeys): void {
        switch (key) {
            case enKeys.A:
                serial.writeString("$A1#");
                basic.pause(50);
                serial.writeString("$A0#");
                break;
            case enKeys.B:
                serial.writeString("$B1#");
                basic.pause(50);
                serial.writeString("$B0#");
                break;
            case enKeys.C:
                serial.writeString("$C1#");
                basic.pause(50);
                serial.writeString("$C0#");
                break;
            case enKeys.D:
                serial.writeString("$D1#");
                basic.pause(50);
                serial.writeString("$D0#");
                break;
            case enKeys.E:
                serial.writeString("$E1#");
                basic.pause(50);
                serial.writeString("$E0#");
                break;
            case enKeys.F:
                serial.writeString("$F1#");
                basic.pause(50);
                serial.writeString("$F0#");
                break;
            case enKeys.G:
                serial.writeString("$G1#");
                basic.pause(50);
                serial.writeString("$G0#");
                break;
            case enKeys.H:
                serial.writeString("$H1#");
                basic.pause(50);
                serial.writeString("$H0#");
                break;
            case enKeys.I:
                serial.writeString("$I1#");
                basic.pause(50);
                serial.writeString("$I0#");
                break;
            case enKeys.J:
                serial.writeString("$J1#");
                basic.pause(50);
                serial.writeString("$J0#");
                break;
            case enKeys.K:
                serial.writeString("$K1#");
                basic.pause(50);
                serial.writeString("$K0#");
                break;
            case enKeys.L:
                serial.writeString("$L1#");
                basic.pause(50);
                serial.writeString("$L0#");
                break;
            case enKeys.M:
                serial.writeString("$M1#");
                basic.pause(50);
                serial.writeString("$M0#");
                break;
            case enKeys.N:
                serial.writeString("$N1#");
                basic.pause(50);
                serial.writeString("$N0#");
                break;
            case enKeys.O:
                serial.writeString("$O1#");
                basic.pause(50);
                serial.writeString("$O0#");
                break;
            case enKeys.P:
                serial.writeString("$P1#");
                basic.pause(50);
                serial.writeString("$P0#");
                break;
            case enKeys.Q:
                serial.writeString("$Q1#");
                basic.pause(50);
                serial.writeString("$Q0#");
                break;
            case enKeys.R:
                serial.writeString("$R1#");
                basic.pause(50);
                serial.writeString("$R0#");
                break;
            case enKeys.S:
                serial.writeString("$S1#");
                basic.pause(50);
                serial.writeString("$S0#");
                break;
            case enKeys.T:
                serial.writeString("$T1#");
                basic.pause(50);
                serial.writeString("$T0#");
                break;
            case enKeys.U:
                serial.writeString("$U1#");
                basic.pause(50);
                serial.writeString("$U0#");
                break;
            case enKeys.V:
                serial.writeString("$V1#");
                basic.pause(50);
                serial.writeString("$V0#");
                break;
            case enKeys.W:
                serial.writeString("$W1#");
                basic.pause(50);
                serial.writeString("$W0#");
                break;
            case enKeys.X:
                serial.writeString("$X1#");
                basic.pause(50);
                serial.writeString("$X0#");
                break;
            case enKeys.Y:
                serial.writeString("$Y1#");
                basic.pause(50);
                serial.writeString("$Y0#");
                break;
            case enKeys.Z:
                serial.writeString("$Z1#");
                basic.pause(50);
                serial.writeString("$Z0#");
                break;
            default: break;
        }
    }
}
