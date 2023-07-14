let speak;
if ("speechSynthesis" in window) {
    // (B) POPULATE AVAILABLE VOICES
    var voice = speechSynthesis.getVoices().find((v, i) => {
        if (v.name.toLowerCase().indexOf("english") > -1) {
            return i;
        }
    });

    // (C) SPEAK
    speak = (text) => {
        let msg = new SpeechSynthesisUtterance();
        msg.voice = speechSynthesis.getVoices()[voice];
        msg.rate = "0.6";
        msg.text = text;
        speechSynthesis.speak(msg);
        return false;
    };
}