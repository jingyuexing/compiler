enum TokenType {
  NUM = 0, // 数字 0-9.
  PLUS, // 加号 +
  MINUS, // 减号 -
  MULT, // 乘号 *
  DIV, // 除号 /
  MOD, // 求模符号 %
  EQ, // 等于号 =
  GT, // 大于号 >
  LT, // 小于号 <
  AND, // 与 &
  OR, // 或 |
  XOR, // 异或 ^
  NOT, // 取反 ~
  NE, // 不等于
  EXTENDS,
  LPARENT , // 左圆括号 (
  RPARENT , // 右圆括号 )
  LBRACES, // 左花括号 {
  RBRACES , // 右花括号 }
  LBRACKETS, // 左方括号 [
  RBRACKETS, // 右方括号 ]
  KEYWORD_IF, // 关键字 if
  KEYWORD_ELSE, // 关键字 else
  KEYWORD_WHILE, // 关键字 while
  KEYWORD_RETURN, // 关键字 return
  KEYWORD_CALL, // 关键字 call
  KEYWORD_FOR, // 关键字 for
  KEYWORD_CHANNEL, // 关键字 channel,
  KEYWORD_VARIABLE,
  SYMBOL,
  RANGE,
  DOT,
  EOF
}

class Token {
  constructor(public readonly token: TokenType, public readonly value: string|number) {}
}

export function Lexer(code: string) {
  // 数字
  let NUMERIC = "0123456789";
  // 十六进制
  let HEX = "abcdefABCDEF";
  // 字母
  let ALPHNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$";
  // 操作符
  let OPERATE = "+-*/%~<!|~=>@.";
  // 空白字符
  let WHITESPACE = "\t\n ";
  let tokens: Token[] = [];
  let codeIndex = 0;
  while (codeIndex < code.length) {
    let singleChar = code[codeIndex];
    if (NUMERIC.includes(singleChar)) {
      let n = codeIndex + 1;
      while (n < code.length && (NUMERIC + "_." + HEX).includes(code[n])) {
        n++;
      }
      if(code.slice(codeIndex, n).includes(".")){
          
          tokens.push(new Token(TokenType.NUM, parseFloat(code.slice(codeIndex, n))));
        }else{
          tokens.push(new Token(TokenType.NUM, parseInt(code.slice(codeIndex, n))));
      }
      codeIndex = n;
    } else if (WHITESPACE.includes(singleChar)) {
      codeIndex++;
    } else if (OPERATE.includes(singleChar)) {
      switch (singleChar) {
        case "&":
          tokens.push(new Token(TokenType.AND, singleChar));
          codeIndex++;
          break;
        case "|":
          tokens.push(new Token(TokenType.OR, singleChar));
          codeIndex++;
          break;
        case "^":
          tokens.push(new Token(TokenType.XOR, singleChar));
          codeIndex++;
          break;
        case "%":
          tokens.push(new Token(TokenType.MOD, singleChar));
          codeIndex++;
          break;
        case "~":
          tokens.push(new Token(TokenType.NOT, singleChar));
          codeIndex++;
          break;
        case "=":
          tokens.push(new Token(TokenType.PLUS, singleChar));
          codeIndex++;
          break;
        case ".":
            if(code.slice(codeIndex,codeIndex + 3)=== "..."){
                tokens.push(new Token(TokenType.RANGE,code.slice(codeIndex,codeIndex+3)))
                codeIndex+=3;
            }else{
                codeIndex ++;
            }
        case "@":
          if (code.slice(codeIndex, codeIndex + 2) === "@>") {
            tokens.push(new Token(TokenType.EXTENDS, code.slice(codeIndex,codeIndex+2)));
            codeIndex += 2;
          }else{
            codeIndex++;
          }
          break;
        case "+":
          if (code.slice(codeIndex, codeIndex + 2) === "+=") {
            tokens.push(new Token(TokenType.PLUS, code.slice(codeIndex, codeIndex + 2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.PLUS, singleChar));
            codeIndex++;
          }
          break;
        case "-":
          if (code.slice(codeIndex, codeIndex + 2) === "-=") {
            tokens.push(new Token(TokenType.MINUS, code.slice(codeIndex, codeIndex + 2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.MINUS, singleChar));
            codeIndex++;
          }
          break;
        case "/":
          if (code.slice(codeIndex, codeIndex + 2) === "/=") {
            tokens.push(new Token(TokenType.DIV, code.slice(codeIndex, codeIndex + 2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.DIV, singleChar));
            codeIndex++;
          }
          break;
        case "*":
          if (code.slice(codeIndex, codeIndex + 2) === "*=") {
            tokens.push(new Token(TokenType.MULT, code.slice(codeIndex,codeIndex+2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.MULT, singleChar));
            codeIndex++;
          }
          break;
        case "%":
          if (code.slice(codeIndex, codeIndex + 2) === "%=") {
            tokens.push(new Token(TokenType.MOD, code.slice(codeIndex, codeIndex + 2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.MOD, singleChar));
            codeIndex ++;
          }
          break;
        case ">":
          if (code.slice(codeIndex, codeIndex + 2) === ">=") {
            tokens.push(new Token(TokenType.GT, code.slice(codeIndex, codeIndex + 2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.GT, singleChar));
            codeIndex++;
          }
          break;
        case "<":
          if (code.slice(codeIndex, codeIndex + 2) === "<=") {
            tokens.push(new Token(TokenType.LT, code.slice(codeIndex, codeIndex + 2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.LT, singleChar));
            codeIndex++;
          }
          break;
        case "!":
          if (code.slice(codeIndex, codeIndex + 2) === "!=") {
            tokens.push(new Token(TokenType.NE, code.slice(codeIndex, codeIndex + 2)));
            codeIndex += 2;
          } else {
            tokens.push(new Token(TokenType.NOT, singleChar));
            codeIndex++;
          }
          break;
      }
    } else if ("{}".includes(singleChar) || "[]".includes(singleChar) || "()".includes(singleChar)) {
      switch (singleChar) {
        case "(":
          tokens.push(new Token(TokenType.LPARENT, singleChar));
          break;
        case ")":
          tokens.push(new Token(TokenType.RPARENT, singleChar));
          break;
        case "{":
          tokens.push(new Token(TokenType.LBRACES, singleChar));
          break;
        case "}":
          tokens.push(new Token(TokenType.RBRACES, singleChar));
          break;
        case "[":
          tokens.push(new Token(TokenType.LBRACKETS, singleChar));
          break;
        case "]":
          tokens.push(new Token(TokenType.RBRACKETS, singleChar));
          break;
      }
      codeIndex++;
    } else if (ALPHNUM.includes(singleChar)) {
      let w = codeIndex + 1;
      while (w < code.length && (ALPHNUM+NUMERIC+ "_").includes(code[w])) {
        w++;
      }
      let word = code.slice(codeIndex, w);
      switch (word) {
        case "IF":
        case "if":
          tokens.push(new Token(TokenType.KEYWORD_IF, word));
          break;
        case "ELSE":
        case "else":
          tokens.push(new Token(TokenType.KEYWORD_ELSE, word));
          break;
        case "WHILE":
        case "while":
          tokens.push(new Token(TokenType.KEYWORD_WHILE, word));
          break;
        case "for":
        case "FOR":
          tokens.push(new Token(TokenType.KEYWORD_FOR, word));
          break;
        case "CALL":
        case "call":
          tokens.push(new Token(TokenType.KEYWORD_CALL, word));
          break;
        case "CHANNEL":
        case "channel":
          tokens.push(new Token(TokenType.KEYWORD_CHANNEL, word));
          break;
        case "var":
        case "VAR":
          tokens.push(new Token(TokenType.KEYWORD_VARIABLE, word));
          break;
        default:
          tokens.push(new Token(TokenType.SYMBOL, word));
      }
      codeIndex = w;
    }else if(";".includes(singleChar)){
        tokens.push(new Token(TokenType.EOF,singleChar))
        codeIndex++;
    } else {
      throw new Error("未知的字符: " + singleChar);
    }
  }
  return tokens;
}


let l = Lexer(`
    ((12+33.5+12)+12/34*32)+66.796
    if 1233 else 32
    channel A @> B 12 != 3334;
    12>= 23;
    4>= 3;
    34<= 23;
    sim += 23;
    for i ... 20{
        12 JK 33;
        c3 d5 s6;
        $0 c4 Margin;
        let s = 33;
    }
`);
// this will be return:
// [
//   Token { token: 14, value: '(' },
//   Token { token: 14, value: '(' },
//   Token { token: 0, value: '12' },
//   Token { token: 1, value: '+' },
//   Token { token: 0, value: '33.5' },
//   Token { token: 1, value: '+' },
//   Token { token: 0, value: '12' },
//   Token { token: 15, value: ')' },
//   Token { token: 1, value: '+' },
//   Token { token: 0, value: '12' },
//   Token { token: 4, value: '/' },
//   Token { token: 0, value: '34' },
//   Token { token: 3, value: '*' },
//   Token { token: 0, value: '32' },
//   Token { token: 15, value: ')' },
//   Token { token: 1, value: '+' },
//   Token { token: 0, value: '66.796' },
//   Token { token: 20, value: 'if' },
//   Token { token: 0, value: '12' },
//   Token { token: 7, value: '>' },
//   Token { token: 0, value: '33' },
//   Token { token: 21, value: 'else' },
//   Token { token: 0, value: '32' },
//   Token { token: 26, value: 'channel' },
//   Token { token: 0, value: '3' }
// ]

console.log(l);
