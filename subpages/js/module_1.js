import XMLconverter from "../../models/XMLconverter.js";
const xml = new XMLconverter("./../media/data/riwi_module_1.xml")
const chargue = async ()=>{
    const cards = await xml.createDetailsCards();
    const container = document.querySelector("main > div")
    for (const card of cards){
        container.appendChild(await card)
    }

}
chargue()