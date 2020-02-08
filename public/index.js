addEventListener("load", async function () {

    async function refresh() {
        const day = await (await fetch('/get-day')).json();

        document.querySelector("#day-indicator").innerHTML = day.friendly;
        document.querySelector("#viewer").innerHTML = `Today:`;
    }

    document.querySelector("#open-btn").addEventListener("click", function () {
        document.querySelector("#calculator").classList.toggle("visible");
    });

    document.querySelector("#close-btn").addEventListener("click", function () {
        document.querySelector("#calculator").classList.remove("visible");
    });

    await refresh();

    document.querySelector("#refresh-btn").addEventListener("click", async function () {
        document.querySelector("#day-indicator").innerHTML = "Hold tight...";

        await refresh();
    });

    document.querySelector("#abs-btn").addEventListener("click", function () {
        document.querySelector("#relative-date").classList.remove('visible');
        document.querySelector("#absolute-date").classList.toggle('visible');
    });

    document.querySelector("#rlv-btn").addEventListener("click", function () {
        document.querySelector("#absolute-date").classList.remove("visible");
        document.querySelector("#relative-date").classList.toggle('visible');
    });

    document.querySelector("#relative-calc-btn").addEventListener("click", async function () {
        const days = document.querySelector("#days").value;

        const dayReq = await fetch(`/get-day?date=${days}&relative=true`);
        const req = await dayReq.json();

        if (!dayReq.ok)
            document.querySelector("#relative-date .error").innerHTML = req.message;
        else {
            document.querySelector("#day-indicator").innerHTML = req.friendly;
            document.querySelector("#calculator").classList.remove('visible');
            document.querySelector("#viewer").innerHTML = days > 1 ? `In ${days} days:` : "Tomorrow";
        }
    });

    document.querySelector("#absolute-calc-btn").addEventListener("click", async function () {
        const source = document.querySelector("#date").value;

        const date = new Date(source);

        if (!(date instanceof Date && !isNaN(date.getTime()))) {
            document.querySelector("#absolute-date .error").innerHTML = "Please select a valid date";
        } else {
            const req = await fetch(`/get-day?date=${date.getTime()}`);
            const day = await (req).json();

            if (!req.ok)
                document.querySelector("#absolute-date .error").innerHTML = day.message;
            else {
                document.querySelector("#day-indicator").innerHTML = day.friendly;
                document.querySelector("#calculator").classList.remove('visible');
                document.querySelector("#viewer").innerHTML = `On ${date.toLocaleDateString()}:`;
            }
        }
    });
});
