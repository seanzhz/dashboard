import {allNav} from "./allNav";
import {all} from "axios";

export const getNav = (role)=>{
    const renderedNav = []

    for (let i = 0; i < allNav.length; i++) {
       if(role === allNav[i].role){
           renderedNav.push(allNav[i])
       }
    }
    return renderedNav
}