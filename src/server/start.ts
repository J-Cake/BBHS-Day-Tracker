import getDay from "../API/getDay";
// import genKey, {loadStack} from "../API/db/genKey";

export default async function (): Promise<void> {
    // data.dateEnabled = new Date().getTime();
    // fs.writeFileSync("./data.json", JSON.stringify(data, null, 4), "utf8");

    getDay(); // This also contains a write call

    // await loadStack(); // TODO: Implement Database

    // console.log("Key:", await genKey());
}
