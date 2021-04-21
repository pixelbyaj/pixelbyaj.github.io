(() => {
    const number = document.getElementById("numbers");
    let code = 0;
    const numberCheck = (e) => {
        return !(e.which >= 48 && e.which <= 57);
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

    number.addEventListener("keypress", (e) => {
        if (numberCheck(e)) {
            e.preventDefault();
        } else {
            addRandomColor(e.target);
            setTimeout(() => {
                e.target.value += " ";
                e.target.value = e.target.value.replace('  ', ' ');
            }, 500)
        }
    }, false);
    number.focus();
})();