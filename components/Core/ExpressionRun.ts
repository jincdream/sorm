import * as esprima from 'esprima'

const Compare = function(left: any, operator: string ,right: any){
  switch(operator){
    case "+":
      return left + right
    case "-":
      return left - right
    case "*":
      return left * right
    case "/":
      return left / right
    case "%":
      return left % right
    case "**":
      return left ** right
    case "&&":
      return left && right
    case "||":
      return left || right
    case "in":
      return left in right
    case "instanceof":
      return left instanceof right
    case "<":
      return left < right
    case ">":
      return left > right
    case "==":
      return left == right
    case "===":
      return left === right
    case ">=":
      return left >= right
    case "<=":
      return left <= right
    case "!=":
      return left != right
    case "!==":
      return left !== right
  }
}

const Update = function(value, operator, prefix){
  switch(operator){
    case "++":
      if(prefix){
        return ++value
      }else{
        return value++
      }
    case "--":
      if(prefix){
        return --value
      }else{
        return value--
      }
  }
}

const run = function(node, objValue = {}){
  if(node.type === "Literal"){
    return node.value
  }
  if(node.type === "Identifier"){
    return objValue[node.name]
  }

  if(node.type === "ConditionalExpression"){
    let result = run(node.test, objValue)
    if(result) return run(node.consequent, objValue)
    else return run(node.consequent, objValue)
  }

  if(node.type === "BinaryExpression"
    || node.type === "LogicalExpression"){
    let left = run(node.left, objValue)
    let right = run(node.right, objValue)
    return Compare(left, node.operator, right)
  }

  if(node.type === "UpdateExpression"){
    return Update(run(node.argument, objValue), node.operator, node.prefix)
  }

  if(node.type === "MemberExpression"){
    let propValue = run(node.object, objValue)
    return run(node.property, propValue)
  }
}

export default function ExpressionRun(expression: string, value){
  let node = esprima.parseScript(expression).body[0]
  if(node.type !== "ExpressionStatement")return false
  return run(node.expression, value)
}