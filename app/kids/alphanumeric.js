(() => {
    const alphabet = document.getElementById("alphanumeric");
    let code = 0;
    const alphaCheck = (e) => {
        return !((e.which >= 65 && e.which <= 90 || e.which >= 97 && e.which <= 122));
    }
    const numberCheck = (e) => {
        return !((e.which >= 48 && e.which <= 57) || e.which === 32);
    }
    const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;

    }
    const addRandomColor = (ele) => {
        var r = getRandomNumber(0, 255);
        var g = getRandomNumber(0, 255);
        var b = getRandomNumber(0, 255);
        ele.style.color = `rgb(${r},${g},${b})`;
    }

    alphabet.addEventListener("keypress", (e) => {
        if (alphaCheck(e) && numberCheck(e)) {
            e.preventDefault();
        } else {
            /*if (e.which >= 65 && e.which <= 90) {
                e.target.value += `${e.key.toLocaleLowerCase()}`;
            } else if (e.which >= 97 && e.which <= 122) {
                e.target.value += `${e.key.toLocaleUpperCase()}`;
            }*/
            addRandomColor(e.target);
        }
    }, false);
    alphabet.focus();
})();