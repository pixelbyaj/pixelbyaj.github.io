class Loader {
    constructor(link, canvas) {
        this.link = link;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.strokeStyle = "white";
        this.context.fillStyle = 'white';

    }
    setProgress() {
        const startAngle = 1.5 * Math.PI;
        this.context.clearRect(0, 0, 16, 16);
        this.context.beginPath();
        this.context.arc(8, 8, 5, startAngle, (progress * 2 * Math.PI) / 100 + startAngle);
        this.context.stroke();
        this.context.font = "20px 'Roboto Slab', serif #fff";
        this.context.fillText("A", 5, 12);
        this.link.href = this.canvas.toDataURL("image/png"); // update favicon
    }
}

const canvas = document.querySelector("#loader");
const link = document.querySelector('link[rel*="icon"]');
const loader = new Loader(link, canvas);
let progress = 0;
const loading = () => {
    loader.setProgress(progress);
    if (progress >= 100) {
        return;
    }
    progress++;
    requestAnimationFrame(loading);
}
loading();