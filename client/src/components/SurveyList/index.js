import React, { Component } from "react";
import { PROBLEM_SOLVING_SURVEY, SOCIAL_SURVEY } from "../SurveyForm/constants";
import ListGroup from "react-bootstrap/lib/ListGroup";
import ListGroupItem from "react-bootstrap/lib/ListGroupItem";

export default class SurveyList extends Component {
  render() {
    return (
      <ListGroup variant="flush">
        {[PROBLEM_SOLVING_SURVEY, SOCIAL_SURVEY].map((surveyName, i) => (
          <ListGroupItem
            key={i}
            action
            active={this.props.activeRoom === surveyName}
            onClick={() => this.props.onSurveyClicked(surveyName)}
          >
            {surveyName}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}
