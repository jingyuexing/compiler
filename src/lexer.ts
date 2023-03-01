enum TokenType {
    NUM = 0, // 数字 0-9.
    PLUS = 1, // 加号 +
    MINUS = 2, // 减号 -
    MULT = 3, // 乘号 *
    DIV = 4, // 除号 /
    MOD = 5, // 求模符号 %
    EQ = 6, // 等于号 =
    GT = 7, // 大于号 >
    LT = 8, // 小于号 <
    AND = 9, // 与 &
    OR = 10, // 或 |
    XOR = 11, // 异或 ^
    NOT = 13, // 取反 ~
    LPARENT = 14, // 左圆括号 (
    RPARENT = 15, // 右圆括号 )
    LBRACES = 16, // 左花括号 {
    RBRACES = 17, // 右花括号 }
    LBRACKETS = 18, // 左方括号 [
    RBRACKETS = 19, // 右方括号 ]
    KEYWORD_IF = 20, // 关键字 if
    KEYWORD_ELSE = 21, // 关键字 else
    KEYWORD_WHILE = 22, // 关键字 while
    KEYWORD_RETURN = 23, // 关键字 return
    KEYWORD_CALL,     // 关键字 call
    KEYWORD_FOR,     // 关键字 for
    KEYWORD_CHANNEL, // 关键字 channel
}

class Token {
    constructor(
        public readonly token: TokenType,
        public readonly value: string
    ) {}
}

export function Lexer(code: string) {
    // 数字
    let NUMERIC = "0123456789";
    // 十六进制
    let HEX = NUMERIC + "abcdefABCDEF";
    // 字母
    let ALPHNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    // 操作符
    let OPERATE = "+-*/%~<!|~=>"
    // 空白字符
    let WHITESPACE = "\t\n ";
    let tokens: Token[] = [];
    let codeIndex = 0
    while (codeIndex < code.length) {
        let singleChar = code[codeIndex];
        if (NUMERIC.includes(singleChar)) {
            let n = codeIndex + 1;
            while (n < code.length && (NUMERIC + "_.").includes(code[n])) {
                n++;
            }
            tokens.push(new Token(TokenType.NUM, code.slice(codeIndex, n)))
            codeIndex = n;
        } else if (WHITESPACE.includes(singleChar)) {
            codeIndex++;
        } else if (OPERATE.includes(singleChar)) {
            switch (singleChar) {
                case "+":
                    tokens.push(new Token(TokenType.PLUS, singleChar))
                    break;
                case "-":
                    tokens.push(new Token(TokenType.MINUS, singleChar))
                    break;
                case "*":
                    tokens.push(new Token(TokenType.MULT, singleChar))
                    break;
                case "&":
                    tokens.push(new Token(TokenType.AND, singleChar))
                    break;
                case "|":
                    tokens.push(new Token(TokenType.OR, singleChar))
                    break;
                case "^":
                    tokens.push(new Token(TokenType.XOR, singleChar))
                    break;
                case "%":
                    tokens.push(new Token(TokenType.MOD, singleChar))
                    break;
                case "~":
                    tokens.push(new Token(TokenType.NOT, singleChar))
                    break;
                case "/":
                    tokens.push(new Token(TokenType.DIV, singleChar))
                    break;
                case ">":
                    tokens.push(new Token(TokenType.GT, singleChar))
                    break;
                case "<":
                    tokens.push(new Token(TokenType.LT, singleChar))
                    break;
                case "=":
                    tokens.push(new Token(TokenType.PLUS, singleChar))
                    break;
                default:
                    break;   
            }
            codeIndex++;
        } else if ("{}".includes(singleChar) || "[]".includes(singleChar) || "()".includes(singleChar)) {
            switch (singleChar) {
                case "(":
                    tokens.push(new Token(TokenType.LPARENT, singleChar))
                    break;
                case ")":
                    tokens.push(new Token(TokenType.RPARENT, singleChar))
                    break
                case "{":
                    tokens.push(new Token(TokenType.LBRACES, singleChar))
                    break;
                case "}":
                    tokens.push(new Token(TokenType.RBRACES, singleChar))
                    break;
                case "[":
                    tokens.push(new Token(TokenType.LBRACKETS, singleChar))
                    break;
                case "]":
                    tokens.push(new Token(TokenType.RBRACKETS, singleChar))
                    tokens.push()
                    break;
            }
            codeIndex++;
        } else if (ALPHNUM.includes(singleChar)) {
            let w = codeIndex + 1;
            while (w < code.length && ALPHNUM.includes(code[w])) {
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
                default:
                    throw new Error("unknow keyword:" + word);
            }
            codeIndex = w;
        }
        else {
            throw new Error("未知的字符: " + singleChar);
        }
    }
    return tokens;
}

let l = Lexer("((12+33.5+12)+12/34*32)+66.796 if 12>33 else 32 channel 3") 
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