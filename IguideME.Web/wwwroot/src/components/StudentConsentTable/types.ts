import { ConsentData } from "../../models/app/ConsentData";
import { GoalData } from "../../models/app/GoalData";

export interface IProps {
}

export interface IState {
   consents: ConsentData[];
   goals: GoalData[];
}