import React, { PureComponent } from "react";
import { CheckCircleOutlined } from '@ant-design/icons';
import {Timeline} from "antd";
import {store} from "../../../utils/configureStore";
import {ITile} from "../../../models/ITile";
import {isGradeSufficient} from "../../../utils/helpers";

export default class OutcomeView extends PureComponent {

  createObjectives = () => {
    const state = store.getState();
    const OBJECTIVES = [
      {
        //1
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;
          return (isGradeSufficient(exams.entries.length > 0 ? (exams.entries[0].grade || 0) : 0));
        },
        description: "de kernbegrippen uit de farmacokinetiek (halfwaardetijd, verdelingsvolume e.d.) onderscheiden en" +
          " toepassen"
      },
      {
        //2
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;
          return (isGradeSufficient(exams.entries.length > 0 ? (exams.entries[0].grade || 0) : 0));
        },
        description: "de kernbegrippen uit de farmacodynamiek (receptoraffiniteit, agonisme, antagonisme," +
          " concentratie-responsrelatie e.d.) onderscheiden en toepassen"
      },
      {
        //3
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;
          return (isGradeSufficient(exams.entries.length > 0 ? (exams.entries[0].grade || 0) : 0));
        },
        description: "farmacokinetische en farmacodynamische eigenschappen van neurofarmaca evalueren om zo te" +
          " interpreteren hoe deze van belang zijn voor de farmacotherapeutische toepasbaarheid en effectiviteit van" +
          " deze (potentiële) geneesmiddelen"
      },
      {
        //4
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;

          const exam2 = (isGradeSufficient(exams.entries.length > 1 ? (exams.entries[1].grade || 0) : 0));
          const exam3 = (isGradeSufficient(exams.entries.length > 2 ? (exams.entries[2].grade || 0) : 0));

          const practice_sessions: ITile = state.tiles.find((tile: ITile) => tile.name === "Practice Sessions");
          if (!practice_sessions) return false;

          const perusall: ITile = state.tiles.find((tile: ITile) => tile.name === "Perusall Assignments");
          if (!perusall) return false;

          return exam2 && exam3 && practice_sessions.entries.length >= 2 && perusall.entries.length >= 3;
        },
        description: "uitleggen (in een presentatie) welke (biologische) processen leiden tot de klinische" +
          " verschijnselen van hersenaandoeningen"
      },
      {
        //5
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;

          const exam2 = (isGradeSufficient(exams.entries.length > 1 ? (exams.entries[1].grade || 0) : 0));
          const exam3 = (isGradeSufficient(exams.entries.length > 2 ? (exams.entries[2].grade || 0) : 0));

          const practice_sessions: ITile = state.tiles.find((tile: ITile) => tile.name === "Practice Sessions");
          if (!practice_sessions) return false;

          const perusall: ITile = state.tiles.find((tile: ITile) => tile.name === "Perusall Assignments");
          if (!perusall) return false;

          return exam2 && exam3 && practice_sessions.entries.length >= 2 && perusall.entries.length >= 3;
        },
        description: "uitleggen (in een presentatie) hoe huidige (psycho)biologische onderzoeksbenaderingen inzicht" +
          " verschaffen in de diverse ziektebeelden"
      },
      {
        //6
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;

          const exam2 = (isGradeSufficient(exams.entries.length > 1 ? (exams.entries[1].grade || 0) : 0));
          const exam3 = (isGradeSufficient(exams.entries.length > 2 ? (exams.entries[2].grade || 0) : 0));

          const practice_sessions: ITile = state.tiles.find((tile: ITile) => tile.name === "Practice Sessions");
          if (!practice_sessions) return false;

          const perusall: ITile = state.tiles.find((tile: ITile) => tile.name === "Perusall Assignments");
          if (!perusall) return false;

          return exam2 && exam3 && practice_sessions.entries.length >= 2 && perusall.entries.length >= 3;
        },
        description: "een samenvatting in eigen woorden geven van de gangbare farmacotherapieën en hoe die leiden tot" +
          " verlichting van de klinische symptomen"
      },
      {
        //7
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;
          return isGradeSufficient(exams.entries.length > 0 ? (exams.entries[0].grade || 0) : 0);
        },
        description: "de verschillende aspecten van het “research & development” van geneesmiddelen benoemen en" +
          " uitleggen hoe deze worden toegepast bij de ontwikkeling van nieuwe geneesmiddelen"
      },
      {
        //8
        achieved: () => {
          const exams: ITile = state.tiles.find((tile: ITile) => tile.name === "Exam grades");
          if (!exams) return false;

          const exam2 = (isGradeSufficient(exams.entries.length > 1 ? (exams.entries[1].grade || 0) : 0));
          const exam3 = (isGradeSufficient(exams.entries.length > 2 ? (exams.entries[2].grade || 0) : 0));

          const practice_sessions: ITile = state.tiles.find((tile: ITile) => tile.name === "Practice Sessions");
          if (!practice_sessions) return false;

          const perusall: ITile = state.tiles.find((tile: ITile) => tile.name === "Perusall Assignments");
          if (!perusall) return false;

          return exam2 && exam3 && practice_sessions.entries.length >= 2 && perusall.entries.length >= 3;
        },
        description: "evalueren welke problemen kleven aan het gebruik van de beschikbare neurofarmaca en hoe naar" +
          " aanleiding daarvan nieuwe geneesmiddelen zouden kunnen worden ontwikkeld"
      }
    ];

    return OBJECTIVES;
  }

  render() {
    return (
      <div style={{ marginTop: 20 }}>
        <Timeline>
          { this.createObjectives().map(obj => {
            if (obj.achieved()) {
              return (
                <Timeline.Item dot={<CheckCircleOutlined />} color="green">
                  { obj.description }
                </Timeline.Item>
              )
            }
            return (
              <Timeline.Item color="orange">
                { obj.description }
              </Timeline.Item>
            )
          })}
        </Timeline>
      </div>
    )
  }
}