# 词法分析器的作用是将代码分割成一个个可以解释的token,
# 用以供后续的Parser进行解析

from enum import Enum
from typing import List

class TokenType(Enum):
    NUM = 0 # 数字
    PLUS = 1 # 加号
    MINUS = 2 # 减号
    MULT = 3  # 乘号
    DIV = 4 # 除号
    MOD = 5 # 求模符号
    EQ = 6 # 等于号
    GT = 7 # 大于号
    LT = 8 # 小于号
    AND = 9 # 与
    OR = 10 # 或
    XOR = 11 # 异或
    NOT = 13 # 取反
    LPARENT = 14
    RPARENT = 15
    LBRACES = 16 # 
    RBRACES = 17
    LBRACKETS = 18
    RBRACKETS = 19

class Token:
    token_type:TokenType
    value:str
    def __init__(self,token_type:TokenType,value:str) -> None:
        self.token_type = token_type
        self.value = value
    def __repr__(self) -> str:
        return f"Toekn({self.token_type}-> { self.value })"

DIGITS = "0123456789"
HEX = "0123456789abcdefABCDEF"
OPERATORS = "=+-*/%><^|&~"
BRACES = "{}"
BRACKETS = "[]"
PARENT = "()"
WHITESPACE = "\t\n "

# 词法分析
def lexer(code):
    token = []
    i = 0
    while i < len(code):
        single_char = code[i]
        if single_char in DIGITS:
            # 如果是数字,则将连续的数字合并成一个token
            j = i + 1
            DIGITS_ = DIGITS+"."
            while(j<len(code) and code[j] in DIGITS_): 
                # 如果词中含有数字和点,都归类为数字
                j += 1 # 记录含有数字的下标 方便后续的取出子字符串
            token.append(Token(TokenType.NUM,code[i:j]))
            i = j # 重置全局的下标计数
        elif(single_char in HEX):
            sub_index = i + 1
            while(sub_index < len(code) and code[sub_index] in HEX):
                sub_index += 1
            token.append(Token(TokenType.NUM,code[i:sub_index]))
        elif(single_char in OPERATORS):
            # 如果是运算符 那就每个运算符单独作为一个token
            if(single_char == "+"):
                token.append(Token(TokenType.PLUS,single_char))
            elif(single_char == "-"):
                token.append(Token(TokenType.MINUS,single_char))
            elif(single_char == "*"):
                token.append(Token(TokenType.MULT,single_char))
            elif(single_char == "/"):
                token.append(Token(TokenType.DIV,single_char))
            elif(single_char == "%"):
                token.append(Token(TokenType.MOD,single_char))
            elif(single_char == ">"):
                token.append(Token(TokenType.GT,single_char))
            elif(single_char == "<"):
                token.append(Token(TokenType.LT,single_char))
            elif(single_char == "~"):
                token.append(Token(TokenType.NOT,single_char))
            elif(single_char == "&"):
                token.append(Token(TokenType.AND,single_char))
            elif(single_char == "|"):
                token.append(Token(TokenType.OR,single_char))
            elif(single_char == "^"):
                token.append(Token(TokenType.XOR,single_char))
            i+=1
        elif(single_char in PARENT or single_char in BRACES or single_char in BRACKETS):
            if(single_char == "("):
                token.append(Token(TokenType.LPARENT,single_char))
            elif(single_char == ")"):
                token.append(Token(TokenType.RPARENT,single_char))
            elif(single_char == "{"):
                token.append(Token(TokenType.LBRACES,single_char))
            elif(single_char == "}"):
                token.append(Token(TokenType.RBRACES,single_char))
            elif(single_char == "["):
                token.append(Token(TokenType.LBRACKETS,single_char))
            elif(single_char== "]"):
                token.append(Token(TokenType.RBRACKETS,single_char))
            i += 1
        elif(single_char in WHITESPACE):
            # 如果是空白字符继续向字符串后面找
            i += 1
        else:
            raise Exception(f"Invalid character: {single_char}")
    return token

# 定义语法分析函数
def parse(tokens:List[Token]):
    # 定义一个指针，指向当前正在处理的 Token
    i = 0

    # 定义一个辅助函数，用于读取下一个 Token
    def next_token():
        nonlocal i
        if i < len(tokens):
            i += 1
            return tokens[i - 1]
        else:
            return None

    # 定义表达式语法规则的解析函数
    def expr():
        left = term()
        token = next_token()
        while token and token.type in (TokenType.PLUS, TokenType.MINUS):
            op = token.type
            right = term()
            left = (op, left, right)
            token = next_token()
        return left

    # 定义项语法规则的解析函数
    def term():
        left = factor()
        token = next_token()
        while token and token.type in (TokenType.MULT, TokenType.DIV, TokenType.MOD):
            op = token.type
            right = factor()
            left = (op, left, right)
            token = next_token()
        return left

    # 定义因子语法规则的解析函数
    def factor():
        token = next_token()
        if token.type == TokenType.NUM:
            return float(token.value)
        elif token.type == TokenType.LPAREN:
            result = expr()
            if next_token().type != TokenType.RPAREN:
                raise Exception("Expected closing parenthesis")
            return result
        else:
            raise Exception("Expected number or opening parenthesis")


if __name__ == '__main__':
    tokens = lexer("""
    1+2/4 = 23.3412
    12 > 45
    62 < 43
    (23+45)
    ^12
    ~333
    """)
    parser_tokens = parse(tokens)
    print(tokens)
    