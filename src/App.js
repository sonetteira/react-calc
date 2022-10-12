import React from "react";
import './App.css';

class Button extends React.Component {
  render() {
    return (
      <button 
        className={this.props.classes}
        id={this.props.id}
        onClick={this.props.onClick}
      >
        {this.props.val}
      </button>
      )
  }
}

class Screen extends React.Component {
  render() {
    return (
      <div className={this.props.classes} id="output">
        <div id="topDisplay">{this.props.top}</div>
        <div id="bottomDisplay">{this.props.bottom}</div>
      </div>
    )
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick= this.handleClick.bind(this);
    this.state = {
      top: "",
      bottom: "0",
      ex1: 0,
      ex2: 0,
      op: null,
      factor: 10,
      reset: false,
    }
  }
  
  extendNumber(a, b, f) {
    let round = 1 / f
    if(f === 10) {
      return a * f + b
    }
    if(f < 1) {
      return Math.round(((a + f * b) + Number.EPSILON) * round) / round
    }
  }
  
  handleNumber(e) {
    let ex1 = this.state.ex1
    let ex2 = this.state.ex2
    let op = this.state.op
    let factor = this.state.factor
    const reset = this.state.reset
    let bottom
    if(reset) {
      ex1 = 0
    }
    if(op == null) { //set ex1
      ex1 = this.extendNumber(ex1, parseInt(e.target.id), factor)
      bottom = ex1
    }
    else { //set ex2
      ex2 = this.extendNumber(ex2, parseInt(e.target.id), factor)
      bottom = ex2
    }
    if(factor < 1) {
      factor /= 10
    }
    this.setState({
      ex1: ex1,
      ex2: ex2,
      bottom: bottom,
      factor: factor,
      reset: false,
    })
  }
  
  handleOperator(e) {
    let ex1 = this.state.ex1
    let ex2 = this.state.ex2
    let op = this.state.op
    if(ex2 !== 0) { //perform calculation and set ex1 equal to result
      ex1 = math(ex1, ex2, op)
      ex2 = 0
    }
    op = e.target.id
    this.setState({
      ex1: ex1,
      ex2: ex2,
      op: op,
      top: `${ex1} ${getOperator(op)}`,
      bottom: ex2,
      factor: 10,
      reset: false,
    })
  }
  
  handleAC(e) {
    this.setState({
      ex1: 0,
      ex2: 0,
      op: null,
      top: "",
      bottom: "0",
      factor: 10,
      reset: false,
    })
  }
  
  handleEqual(e) {
    let ex1 = this.state.ex1
    let ex2 = this.state.ex2
    let op = this.state.op
    ex1 = math(ex1, ex2, op)
    this.setState({
      ex1: ex1,
      ex2: 0,
      op: null,
      top: "",
      bottom: ex1,
      factor: 10,
      reset: true,
    })
  }
  
  handleNeg(e) {
    let ex1 = this.state.ex1
    let ex2 = this.state.ex2
    let op = this.state.op
    let bottom
    if(op == null) { //set ex1
      ex1 = -ex1
      bottom = ex1
    }
    else { //set ex2
      ex2 = -ex2
      bottom = ex2
    }
    this.setState({
      ex1: ex1,
      ex2: ex2,
      bottom: bottom,
    })
  }
  
  handleDec(e) {
    let factor = this.state.factor
    let bottom = this.state.bottom
    const reset = this.state.reset
    if(factor === 10) {
      factor = 0.1
    }
    if(reset) {
      bottom = "0"
    }
    this.setState({
      factor: factor,
      bottom: `${bottom}.`,
    })
  }
  
  handleClick(e) {
    if(e.target.classList.contains("number")) { 
      this.handleNumber(e)
    } else if(e.target.classList.contains("operator")) {
      this.handleOperator(e)
    } else if(e.target.id === "clear") {
      this.handleAC(e)
    } else if(e.target.id === "equal") {
      this.handleEqual(e)
    } else if(e.target.id === "negative") {
      this.handleNeg(e)
    } else if(e.target.id === "decimal") {
      this.handleDec(e)
    }
  }
  
  drawButton(v) {
    return(
      <Button 
        classes = {v[0]}
        id = {v[1]}
        val = {v[2]}
        onClick = {this.handleClick}
      />
    )
  }
  
  render() {
    const col1 = "item1"
    const col2 = "item2"
    const col4 = "item4"
    const num = "number"
    const op = "operator"
    const btns = [
      [`${col1} ${num}`, "7", "7"],
      [`${col1} ${num}`, "8", "8"],
      [`${col1} ${num}`, "9", "9"],
      [`${col1} ${op}`, "divide", "/"],
      [`${col1} ${num}`, "4", "4"],
      [`${col1} ${num}`, "5", "5"],
      [`${col1} ${num}`, "6", "6"],
      [`${col1} ${op}`, "multiply", "x"],
      [`${col1} ${num}`, "1", "1"],
      [`${col1} ${num}`, "2", "2"],
      [`${col1} ${num}`, "3", "3"],
      [`${col1} ${op}`, "subtract", String.fromCharCode(0x2014)],
      [`${col1}`, "negative", "+/-"],
      [`${col1} ${num}`, "0", "0"],
      [`${col1}`, "decimal", "."],
      [`${col1} ${op}`, "add", "+"],
      [`${col2}`, "clear", "AC"],
      [`${col2}`, "equal", "="]
    ]
    return (
      <>
        <Screen classes = {col4} top = {this.state.top} bottom = {this.state.bottom}/>
        {
          btns.map((b) => {
            return (
              this.drawButton(b)
            )
          })
        }
     </>
    )
  }
}

function math(ex1, ex2, op) {
  if(op == null) {
    return ex1
  }
  if(op === "add") {
    return ex1 + ex2
  }
  if(op === "subtract") {
    return ex1 - ex2
  }
  if(op === "multiply") {
    return ex1 * ex2
  }
  if(op === "divide") {
    return ex1 / ex2
  }
}

function getOperator(op) {
  if(op === "add") {
    return "+"
  }
  if(op === "subtract") {
    return "-"
  }
  if(op === "multiply") {
    return "x"
  }
  if(op === "divide") {
    return "/"
  }
}

export default Calculator;
