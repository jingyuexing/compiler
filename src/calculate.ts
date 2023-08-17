enum ETokenType {
    INTEGER,
    FLOAT,
    PLUS,
    MINUS,
    MULT,
    DIV,
    EOF
}
interface IToken {
    type: ETokenType;
    value: number
}

interface ILexer {
    next(): Token
}

interface IParser {
    lexer: ILexer;
    currentToken: IToken
    eat(tokenType: ETokenType): void
    term(): IToken['value']
    expr(): number
}

class Token implements Token {
    type: ETokenType;
    value: number;
    constructor(type: ETokenType, value: any) {
        this.type = type
        this.value = value
    }
}

class Lexer implements ILexer {
    NUMBERIC = "0123456789";
    WHITESPACE = " \t\r";
    ENDOFLINE = "\n;"
    OPERATOR = "+-*/";
    text: string;
    position: number;
    current: string;

    constructor(text: string) {
        this.text = text;
        this.position = 0;
        this.current = text[this.position]
    }
    advance() {
        this.position++;
        if (this.position >= this.text.length) {
            this.current = "";
        } else {
            this.current = this.text[this.position];
        }
    }
    numberic(): Token {
        let result = ""
        while (this.current != "" && (this.NUMBERIC + ".").indexOf(this.current) != -1) {
            result += this.current
            this.advance()
        }
        if (result.indexOf(".") != -1) {
            return new Token(ETokenType.FLOAT, parseFloat(result));
        } else {
            return new Token(ETokenType.INTEGER, parseInt(result));
        }
    }
    skip() {
        while (this.current != "" && this.WHITESPACE.indexOf(this.current) != -1) {
            this.advance()
        }
    }
    oprator(): Token {
        let token: Token | null = null;
        switch (this.current) {
            case "+":
                token = new Token(ETokenType.PLUS, this.current)
                break;
            case "-":
                token = new Token(ETokenType.MINUS, this.current)
                break
            case "*":
                token = new Token(ETokenType.MULT, this.current)
                break
            case "/":
                token = new Token(ETokenType.DIV, this.current)
                break
        }
        this.advance()
        return token!
    }
    next(): Token {
        while (this.current != "") {
            if (this.NUMBERIC.indexOf(this.current) != -1) {
                return this.numberic()
            } else if (this.current != "" && this.ENDOFLINE.indexOf(this.current) != -1) {
                return new Token(ETokenType.EOF, this.current)
            } else if (this.current != "" && this.OPERATOR.indexOf(this.current) != -1) {
                return this.oprator()
            } else if (this.current != "" && this.WHITESPACE.indexOf(this.current) != -1) {
                this.skip()
            } else {
                throw Error("Invalid character")
            }
        }
        return new Token(ETokenType.EOF, "")
    }
}

class Parser implements IParser {
    lexer: ILexer;
    currentToken: IToken;
    constructor(lexer: Lexer) {
        this.lexer = lexer
        this.currentToken = this.lexer.next()!
    }
    eat(tokenType: ETokenType): void {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.next()
        } else {
            throw Error("Invalid syntax")
        }
    }
    expr(): number {
        let result = this.term()
        while (
            this.currentToken.type === ETokenType.MINUS 
            || this.currentToken.type === ETokenType.PLUS 
            || this.currentToken.type === ETokenType.DIV 
            || this.currentToken.type === ETokenType.MULT
        ) {
            if (this.currentToken.type === ETokenType.PLUS) {
                this.eat(this.currentToken.type)
                result += this.term()
            } else if (this.currentToken.type === ETokenType.MINUS) {
                this.eat(this.currentToken.type)
                result -= this.term()
            } else if (this.currentToken.type === ETokenType.MULT) {
                this.eat(this.currentToken.type)
                result = result * this.term()
            } else if (this.currentToken.type === ETokenType.DIV) {
                this.eat(this.currentToken.type)
                if (this.term() == 0) {
                    throw Error("cannot divide by 0")
                } else {
                    result = result / this.term()
                }
            }
        }
        return result
    }
    term(): number {
        let token = this.currentToken;
        if (token.type === ETokenType.INTEGER || token.type === ETokenType.FLOAT) {
            this.eat(token.type)
            return token.value
        } else {
            throw Error("Invalid syntax")
        }
    }
}

const input = '12/3';
const lexer_ = new Lexer(input);
const parser = new Parser(lexer_);
const result = parser.expr();
console.log(result);

