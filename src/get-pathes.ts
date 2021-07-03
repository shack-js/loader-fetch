const acorn = require("acorn-loose")

const ExportNamedDeclaration = 'ExportNamedDeclaration'
  , ExpressionStatement = 'ExpressionStatement'
  , MemberExpression = 'MemberExpression'
  , FunctionDeclaration = 'FunctionDeclaration'
  , VariableDeclaration = 'VariableDeclaration'

export default function getPathes(source:string, sourceType = 'module') {
  // console.log(JSON.stringify(source))
  let node = acorn.parse(source, {
    ecmaVersion: 2020,
    sourceType
  })
  let paths:string[] = []
  recursiveFindExport(node)
  // console.log(`paths`,paths)
  return paths

  function recursiveFindExport(node) {
    // console.log(node)
    switch (node.type) {
      // case ExportDefaultDeclaration:
      // return paths.push('')
      case ExportNamedDeclaration:
        // console.log(node)
        return node.declaration
          ? getExportedNames(node.declaration).forEach(x => paths.push(x))
          : node.specifiers.forEach(x => paths.push(x.exported.name))
      case ExpressionStatement:
        return isModuleExport(node.expression)
      default:
        let nodes = node.body
        nodes && (
          Array.isArray(nodes)
            ? nodes.forEach(x => recursiveFindExport(x))
            : recursiveFindExport(nodes)
        )
    }
  }

  function getExportedNames(node) {
    switch (node.type) {
      case FunctionDeclaration:
        return [node.id.name]
      case VariableDeclaration:
        return node.declarations.map(x => x.id.name)
    }
  }

  function isModuleExport(node) {
    let left = node.left
    // console.log(node)
    if (left && left.type === MemberExpression) {
      if (exactModuleExport(left.object)) {
        return paths.push(left.property.name)
      }
    }
  }

  function exactModuleExport(node) {
    try {
      let rtn = (node.type === MemberExpression
        && node.object.name === 'module'
        && node.property.name === 'exports')
      return rtn
    } catch (e) { }
    return false
  }
}
