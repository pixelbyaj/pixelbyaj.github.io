(() => {
    const alphabet = document.getElementById("alphabets");
    let code = 0;
    const alphaCheck = (e) => {
        return !((e.which >= 65 && e.which <= 90 || e.which >= 97 && e.which <= 122) || e.which === 13);
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
        if (alphaCheck(e)) {
            e.preventDefault();
        } else {
            if (e.which <= 90) {
                e.target.value += `${e.key.toLocaleLowerCase()}`;
            } else {
                e.target.value += `${e.key.toLocaleUpperCase()}`;
            }
            setTimeout(() => {
                e.target.value += " ";
            })
            addRandomColor(e.target);
        }
    }, false);
    alphabet.focus();
})();