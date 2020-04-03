import getDay from "./getDay";

export default function (): void {
    // data.dateEnabled = new Date().getTime();
    // fs.writeFileSync("./data.json", JSON.stringify(data, null, 4), "utf8");

    getDay(); // This also contains a write call
}
